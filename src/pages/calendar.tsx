import dynamic from 'next/dynamic'
import Router from 'next/router'
import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  createRef
} from 'react'
import { observer } from 'mobx-react-lite'
import { EventInput, Calendar } from '@fullcalendar/core'
import { Plus, Search, ChevronLeft, ChevronRight } from 'react-feather'
import daLocale from '@fullcalendar/core/locales/da'
import MobileCalendar from '../components/mobile-calendar'
import Page from '../components/essentials/page'
import CalView from '../models/CalView'
import MeetingModel from '../models/MeetingModel'
import { getCompanyId } from '../services/authService'
import WindowDimensions from '../models/types/WindowDimensions'
import withAuth from '../components/hoc/withAuth'
import rootStore from '../stores/RootStore'
import BottomModal from '../components/essentials/bottom-modal'

import MobileMultiSelecter from '../components/add-meeting'
import { applyOffSet, monthString } from '../services/dateService'
import CustomInput from '../components/Input/custom-input'
import MiddelLoader from '../components/essentials/middelLoading'
import FetchStates from '../stores/requestState'
import MobileCalendarV2 from '../components/mobile-calendarv2'
import FullCalendar from '@fullcalendar/react'

let FullCalendarNoSSRWrapper

const CalendarView = withAuth(
  observer(() => {
    const mobileSwapPoint = 600
    var ref2 = React.useRef<FullCalendar>()

    const { meetingStore, categoriesStore } = useContext(rootStore)
    const {
      meetingStore: { fetchState: meetingState },
      categoriesStore: { fetchState: catState }
    } = useContext(rootStore)
    const [calViewProp, setCalViewProp] = useState({})
    const initEvent: EventInput[] = []
    const [events, setEvnets] = useState(initEvent)
    const [searchWord, setSearchWord] = useState('')
    // const [inputOpen, setInputOpen] = useState(false)

    const [showCal, setShowCal] = useState(false)
    const [windowDim, setWindowDim] = useState({
      width: 100000,
      height: 100000
    } as WindowDimensions)

    const updateWindowDimensions = () => {
      setWindowDim({
        width: window.innerWidth,
        height: window.innerHeight
      } as WindowDimensions)
    }

    useEffect(() => {
      setWindowDim({
        width: window.innerWidth,
        height: window.innerHeight
      } as WindowDimensions)
      window.addEventListener('resize', updateWindowDimensions)
      return () => {
        window.removeEventListener('resize', updateWindowDimensions)
      }
    }, [])

    useEffect(() => {
      FullCalendarNoSSRWrapper = dynamic({
        modules: () =>
          ({
            calendar: import('@fullcalendar/react'),
            timeGridPlugin: import('@fullcalendar/timegrid'),
            interactionPlugin: import('@fullcalendar/interaction'),
            dayGridPlugin: import('@fullcalendar/daygrid'),
            listPlugin: import('@fullcalendar/list')
          } as any),
        render: (props: any, { calendar: Calendar, ...plugins }) => (
          <Calendar ref={ref2} {...props} plugins={Object.values(plugins)} />
        ),
        ssr: false
      })

      // FullCalendarNoSSRWrapper = React.forwardRef((props, ref) => (
      //   <TempCal {...props} forwardedRef={ref} />
      // ))
      setShowCal(true)
    }, [])

    function mapEvents(myevents: MeetingModel[]) {
      return myevents.map(item => {
        return {
          id: item.shortId,
          title: item.name,
          date: applyOffSet(item.startTime).toISOString(),
          startTime: applyOffSet(item.startTime).toISOString(),
          endTime: applyOffSet(item.endTime).toISOString(),
          discription: item.discription,
          topic: item.topic,
          questionSetId: item.questionsSetId
        } as EventInput
      })
    }

    const filterEventsCallback = useCallback(
      (item: EventInput) => {
        if (searchWord.length >= 1) {
          if (item.title?.toLowerCase().includes(searchWord.toLowerCase())) {
            return item
          }
        } else {
          return item
        }
        return null
      },
      [searchWord]
    )

    useEffect(() => {
      categoriesStore.fetchCategories(String(getCompanyId()))
    }, [categoriesStore])

    const refreshMeetings = () => {
      meetingStore
        .fetchMeetings(
          (calViewProp as CalView).activeStart,
          (calViewProp as CalView).activeEnd
        )
        .then(() => {
          setEvnets(mapEvents(meetingStore.meetings))
        })
    }

    useEffect(() => {
      meetingStore
        .fetchMeetings(
          (calViewProp as CalView).activeStart,
          (calViewProp as CalView).activeEnd
        )
        .then(() => {
          setEvnets(mapEvents(meetingStore.meetings))
        })
    }, [calViewProp, meetingStore])

    function clickOnEvent(event: any) {
      Router.push(`/meeting/${event.event.id}`)
    }

    const showCalendar = useCallback(() => {
      if (!showCal) return <></>
      return (
        <>
          <MiddelLoader
            loading={
              !showCal ||
              meetingState === FetchStates.LOADING ||
              catState === FetchStates.LOADING
            }
          />

          <div className='fixed-cal'>
            <div
              className='bar'
              style={{
                display: windowDim.width > mobileSwapPoint ? 'none' : 'block'
              }}
            >
              <div className='date'>
                {monthString(new Date((calViewProp as CalView).activeStart))}
              </div>
              <div className='float-left arrowbtn'>
                <ChevronLeft
                  tabIndex={0}
                  onKeyPress={e => console.log(e)}
                  onClick={() => {}}
                  color='white'
                />
              </div>

              <div className='float-right arrowbtn'>
                <ChevronRight
                  tabIndex={0}
                  onClick={() => {
                    let calendarApi2 = ref2.current.getApi()
                    calendarApi2.next()
                  }}
                  color='white'
                />
              </div>
            </div>
            {/* <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
              <CustomInput
                logo={<Search />}
                fill
                type='text'
                className='filter'
                placeholder='Søgeord'
                value={searchWord}
                onChange={setSearchWord}
              />
            </div> */}

            <FullCalendarNoSSRWrapper
              locale={daLocale}
              trigger={e => console.log(e)}
              // viewHeight={5100}
              // header={false}

              header={
                windowDim.width > mobileSwapPoint
                  ? {
                      right:
                        windowDim.width > mobileSwapPoint
                          ? 'prev,next today myCustomButton'
                          : '',
                      left:
                        windowDim.width > mobileSwapPoint
                          ? 'dayGridMonth,timeGridWeek,listWeek'
                          : '',
                      center: windowDim.width > mobileSwapPoint ? 'title' : ''
                    }
                  : null
              }
              views={{
                dayGridMonth: {
                  // name of view
                  // titleFormat: { year: "numeric", month: "2-digit", day: "2-digit" }
                  // other view-specific options here
                }
              }}
              // customButtons={{
              //   myCustomButton: {
              //     text: 'Tilføj møde',
              //     click: () => Router.push('/meeting/new')
              //   }
              // }}
              defaultView='dayGridMonth'
              weekends
              events={events.filter(filterEventsCallback)}
              weekNumbers={false}
              listDayFormat
              // themeSystem='bootstrap'
              eventClick={(event: any) => {
                if (windowDim.width > mobileSwapPoint) {
                  clickOnEvent(event)
                } else {
                  console.log(event)

                  Router.push(
                    `/meeting/day?date=${new Date(
                      String(event.event.start)
                    ).getTime()}`
                  )
                }
              }}
              datesRender={e => setCalViewProp(e.view)}
              // dayRender={e => console.log("dayRender ", e)}
              dateClick={info => {
                // alert("Clicked on: " + info.dateStr);
                // alert(
                //   "Coordinates: " + info.jsEvent.pageX + "," + info.jsEvent.pageY
                // );
                // alert("Current view: " + info.view.type);
                // change the day's background color just for fun
                // eslint-disable-next-line no-param-reassign
                info.dayEl.style.backgroundColor = 'var(--overlay)'
                Router.push(
                  `/meeting/day?date=${new Date(
                    String(info.dateStr)
                  ).getTime()}`
                )
              }}
              height='parent'
            />
          </div>
        </>
      )
    }, [
      catState,
      events,
      filterEventsCallback,
      meetingState,
      searchWord,
      showCal,
      windowDim.width
    ])

    // <SearchBtn
    //   inputOpen={inputOpen}
    //   setInputOpen={setInputOpen}
    //   searchWord={searchWord}
    //   setSearchWord={setSearchWord}
    // />

    const [showModal, setShowModal] = useState(false)

    return (
      <Page
        title='Kalender'
        showBackButton={false}
        component={<Plus onClick={() => setShowModal(!showModal)} />}
      >
        <BottomModal
          show={showModal}
          content={
            <MobileMultiSelecter
              callBack={refreshMeetings}
              setShowModal={setShowModal}
            />
          }
          setShow={setShowModal}
        />
        {/* <Seachbar value={searchWord} setValue={setSearchWord} /> */}
        {/* <CreateMeetingModal
        questionContext={questionContext}
        setQuestionSet={setQuestionSet}
        endTime={endTime}
        setEndTime={setEndTime}
        startTime={startTime}
        setStartTime={setStartTime}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        date={date}
        setDate={setDate}
        discription={discription}
        setDiscription={setDiscription}
        name={name}
        setName={setName}
        createMeeting={createMeeting}
        toggle={toggle}
      /> */}

        {/* <div className='cal-container'> */}
        {/* {windowDim.width >= 650 ? (
            showCalendar()
          ) : (
            <MobileCalendar dim={windowDim} />
            // <MobileCalendarV2 dim={windowDim} />
          )} */}
        {showCalendar()}
        {/* </div> */}

        <style jsx global>{`
        .text {
            width: fit-content;
            max-width: 90vw;
            display: inline;
            margin-left: 15px;
          }

          .arrow {
            float: right;
            display: inline-block;
            white-space: nowrap;
          }
          .date {
            margin-top: 3px;
            width: 100px;
            left: 50%;
            margin-left: -50px;
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            z-index: 1;
            color: white;
          }
          .arrowbtn {
            z-index: 10;
          }
          .bar {
            margin-top: -35px;
            background-color: var(--accent);
            height: 35px;
            width: 100%;
            left: 0;
            position: absolute;
          }

          .bar div {
            padding: 5px;
          }
        

          {/* .fc-scroller {
            height: 100% !important;
            max-height: 80vh !important;
          } */}

          {/* @media only screen and (max-width: 650px) {
             { */}
              /* .fc-toolbar,
          .fc-header-toolbar {
            font-size: 0.8rem;
            margin-top: -20px;
          }

          .cal-container {
 
            position: absolute;
          }

          .fc-center h2 {
            font-size: 1.2em;
          }

          .fc-today-button {
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
          }

          .fc-left .fc-button-group {
            position: absolute;
            width: 100%;
          }

          .fc-left .fc-button-group button {
            border-radius: 0px;
          }

          .fc-left {
            padding-top: 50px;
          }

          .fc-header-toolbar {
            height: 80px;
          }
        }

        .fc-button-primary:not(:disabled):active,
        .fc-button-primary:not(:disabled).fc-button-active {
          background-color: var(--accent);
          color: #fff;
          box-shadow: 0 0 10px rgba(102, 179, 251, 0.5);
          border: none !important;
        }

        .fc-button-active {
          background-color: var(--accent-dark) !important;
        }

        .fc-button-group button {
          border: 0px;
          box-sizing: border-box;
          background-color: var(--accent);
          box-shadow: 0 0 0 rgba(255, 255, 255, 0);
          -webkit-transition: border-color 0.15s ease-out, color 0.25s ease-out,
            background-color 0.15s ease-out, box-shadow 0.15s ease-out;
          transition: border-color 0.15s ease-out, color 0.25s ease-out,
            background-color 0.15s ease-out, box-shadow 0.15s ease-out; 
          }

          .fc-button-group button:hover {
          background-color: var(--accent-darker);
          }

          .fc-event {
            background-color: var(--accent) ;
            border-color: var(--accent);
            padding: 5px,
          }

          .cal-container {
            position: relative;
          }
          .fc-body {
            height: 90vh
          }

          .fc-row {
            height: auto !important;
          }

          .fc-today {
            background-color: var(--surface) !important;
          } */
            }
          }
        `}</style>
      </Page>
    )
  })
)

export default CalendarView

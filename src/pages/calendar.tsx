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
import { useDrag } from 'react-use-gesture'
import SearchBtn from '../components/search-btn'

let FullCalendarNoSSRWrapper

const CalendarView = withAuth(
  observer(() => {
    const mobileSwapPoint = 600
    var calRef = React.useRef<FullCalendar>()

    const { meetingStore, categoriesStore } = useContext(rootStore)
    const {
      meetingStore: { fetchState: meetingState }
      // categoriesStore: { fetchState: catState }
    } = useContext(rootStore)
    const [calViewProp, setCalViewProp] = useState({})
    const initEvent: EventInput[] = []
    const [events, setEvnets] = useState(initEvent)
    const [searchWord, setSearchWord] = useState('')
    const [inputOpen, setInputOpen] = useState(false)

    const [showCal, setShowCal] = useState(false)
    const [windowDim, setWindowDim] = useState({
      width: 100000,
      height: 100000
    } as WindowDimensions)

    const bind = useDrag(({ movement: [mx] }) => {
      console.log(mx)

      if (mx > 190) {
        let calendarApi2 = calRef.current.getApi()
        calendarApi2.prev()
      } else if (mx < -190) {
        let calendarApi2 = calRef.current.getApi()
        calendarApi2.next()
      }
    })

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
          <Calendar ref={calRef} {...props} plugins={Object.values(plugins)} />
        ),
        ssr: false
      })
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
          let calendarApi2 = calRef.current.getApi()
          calendarApi2.refetchEvents()
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
              !showCal || meetingState === FetchStates.LOADING
              // ||
              // catState === FetchStates.LOADING
            }
          />

          <div className='fixed-cal' {...bind()}>
            <div
              className='bar'
              style={{
                display: windowDim.width > mobileSwapPoint ? 'none' : 'block'
              }}
            >
              <div className='date'>{(calViewProp as CalView).title}</div>
              <div className='float-left arrowbtn'>
                <ChevronLeft
                  tabIndex={0}
                  onKeyPress={e => console.log(e)}
                  onClick={() => {
                    let calendarApi2 = calRef.current.getApi()
                    calendarApi2.prev()
                  }}
                  color='white'
                />
              </div>

              <div className='float-right arrowbtn'>
                <ChevronRight
                  tabIndex={0}
                  onClick={() => {
                    let calendarApi2 = calRef.current.getApi()
                    calendarApi2.next()
                  }}
                  color='white'
                />
              </div>
            </div>
            {/* {windowDim.width > mobileSwapPoint && (
              <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <CustomInput
                  logo={<Search />}
                  fill
                  type='text'
                  className='filter'
                  placeholder='Søgeord'
                  value={searchWord}
                  onChange={setSearchWord}
                />
              </div>
            )} */}
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
      // catState,
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
        component={
          <Plus
            data-cy='add-meeting-btn'
            onClick={() => setShowModal(!showModal)}
          />
        }
        leftComponent={
          <SearchBtn
            data-cy='search-btn'
            inputOpen={inputOpen}
            setInputOpen={setInputOpen}
            searchWord={searchWord}
            setSearchWord={setSearchWord}
          />
        }
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
        {showCalendar()}
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
            width: 150px;
            left: 50%;
            margin-left: -75px;
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
            top: calc(var(--safe-area-inset-top) / 2 + var(--top-bar-height));
            background-color: var(--accent);
            height: 35px;
            width: 100%;
            left: 0;
            position: fixed;
            z-index: 9;
          }

          .bar div {
            padding: 5px;
          }
        `}</style>
      </Page>
    )
  })
)

export default CalendarView

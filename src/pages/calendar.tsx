import dynamic from 'next/dynamic'
import Router from 'next/router'
import React, { useContext, useState, useEffect, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { EventInput } from '@fullcalendar/core'
import { Plus } from 'react-feather'
import MobileCalendar from '../components/mobile-calendar'
import Page from '../components/page'
import CalView from '../models/CalView'
import MeetingModel from '../models/MeetingModel'
import { getCompanyId } from '../services/authService'
import WindowDimensions from '../models/types/WindowDimensions'
import withAuth from '../services/withAuth'
import rootStore from '../stores/RootStore'
import BottomModal from '../components/bottom-modal'

import MobileMultiSelecter from '../components/add-meeting'

let FullCalendarNoSSRWrapper

const CalendarView = withAuth(
  observer(() => {
    const { meetingStore, categoriesStore } = useContext(rootStore)
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
          <Calendar {...props} plugins={Object.values(plugins)} />
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
          date: item.startTime,
          startTime: item.startTime,
          endTime: item.endTime,
          discription: item.discription,
          topic: item.topic,
          questionSetId: item.questionsSetId
        } as EventInput
      })
    }

    // function filterEvents(item: EventInput) {}

    const filterEventsCallback = useCallback(
      (item: EventInput) => {
        if (searchWord.length >= 1 && inputOpen) {
          if (item.title?.toLowerCase().includes(searchWord.toLowerCase())) {
            return item
          }
        } else {
          return item
        }
        return null
      },
      [inputOpen, searchWord]
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
      if (!showCal) return <div>Loading ...</div>
      return (
        <FullCalendarNoSSRWrapper
          trigger={e => console.log(e)}
          // viewHeight={5100}
          // header={false}
          header={
            windowDim.width > 500
              ? {
                  right:
                    windowDim.width > 500
                      ? 'prev,next today myCustomButton'
                      : '',
                  left:
                    windowDim.width > 500
                      ? 'dayGridMonth,timeGridWeek,listWeek'
                      : '',
                  center: windowDim.width > 500 ? 'title' : ''
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
          customButtons={{
            myCustomButton: {
              text: 'Tilføj møde',
              click: () => Router.push('/meeting/new')
            }
          }}
          defaultView='dayGridMonth'
          weekends
          events={events.filter(filterEventsCallback)}
          weekNumbers={false}
          listDayFormat
          // themeSystem='bootstrap'
          eventClick={(event: any) => {
            clickOnEvent(event)
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
            info.dayEl.style.backgroundColor = 'red'
          }}
        />
      )
    }, [events, filterEventsCallback, showCal, windowDim.width])

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

        <div className='cal-container'>
          {windowDim.width >= 650 ? (
            showCalendar()
          ) : (
            <MobileCalendar dim={windowDim} />
          )}
        </div>

        <style jsx global>{`
        .fc-scroller {
          height: 100% !important;
          max-height: 80vh !important;
        }

        @media only screen and (max-width: 650px) {
          .fc-toolbar,
          .fc-header-toolbar {
            font-size: 0.8rem;
            margin-top: -20px;
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
          box-sizing: border-box;
          background-color: var(--accent);
          box-shadow: 0 0 0 rgba(255, 255, 255, 0);
          -webkit-transition: border-color 0.15s ease-out, color 0.25s ease-out,
            background-color 0.15s ease-out, box-shadow 0.15s ease-out;
          transition: border-color 0.15s ease-out, color 0.25s ease-out,
            background-color 0.15s ease-out, box-shadow 0.15s ease-out; 
          }
          .fc-event {
            background-color: var(--accent) ;
            border-color: var(--accent);
            padding: 5px,
          }

          .cal-container {
             height: calc(100% - 250px);
  
          }
          .fc-body {
            height: 90vh
          }

          .fc-row {
            height: auto !important;
          }

          .fc-today {
            background-color: var(--surface) !important;
          }
        }
      `}</style>
      </Page>
    )
  })
)

export default CalendarView

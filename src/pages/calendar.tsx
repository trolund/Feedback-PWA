import dynamic from 'next/dynamic'
import Router from 'next/router'
import React, { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { EventInput, Component } from '@fullcalendar/core'
import Page from '../components/page'
import CalView from '../models/CalView'
import questionSetStore from '../stores/QuestionSetStore'
import meetingStore from '../stores/MeetingStore'
import categoriesStore from '../stores/CategoriesStore'
import MeetingCategory from '../models/MeetingCategory'
import Category from '../models/Category'
import MeetingModel from '../models/MeetingModel'
import states from '../stores/requestState'
import Tag from '../models/tag'

const FullCalendarNoSSRWrapper = dynamic({
  modules: () =>
    ({
      calendar: import('@fullcalendar/react'),
      timeGridPlugin: import('@fullcalendar/timegrid'),
      interactionPlugin: import('@fullcalendar/interaction'),
      dayGridPlugin: import('@fullcalendar/daygrid'),
      listPlugin: import('@fullcalendar/list')
      // momentPlugin: import('@fullcalendar/moment'),
      // momentTimezonePlugin: import('@fullcalendar/moment-timezone')
    } as any),
  render: (props: any, { calendar: Calendar, ...plugins }) => (
    <Calendar {...props} plugins={Object.values(plugins)} />
  ),
  ssr: false,
  loading: () => <p>loading..</p>
})

const Calendar = observer(() => {
  const questionContext = useContext(questionSetStore)
  const meetingStoreContext = useContext(meetingStore)
  const categoriesContext = useContext(categoriesStore)
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [name, setName] = useState('')
  const [discription, setDiscription] = useState('')
  const [questionSet, setQuestionSet] = useState('')
  const [calViewProp, setCalViewProp] = useState({})
  const initEvent: EventInput[] = []
  const [events, setEvnets] = useState(initEvent)
  const [searchWord, setSearchWord] = useState('')
  const init: Tag[] = []
  const [tags, setTags] = useState(init)

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

  function filterEvents(item: EventInput) {
    if (searchWord.length >= 1) {
      if (item.title?.toLowerCase().includes(searchWord.toLowerCase())) {
        return item
      }
    } else {
      return item
    }
    return null
  }

  useEffect(() => {
    categoriesContext.fetchCategories('1')
  }, [categoriesContext])

  useEffect(() => {
    meetingStoreContext
      .fetchMeetings(
        (calViewProp as CalView).activeStart,
        (calViewProp as CalView).activeEnd
      )
      .then(() => {
        setEvnets(mapEvents(meetingStoreContext.meetings))
      })
  }, [calViewProp, meetingStoreContext])

  function createMeeting() {
    const meeting: MeetingModel = {
      discription,
      endTime: endDate,
      startTime: startDate,
      name,
      topic: 'emne',
      questionsSetId: questionSet,
      location: 'et sted',
      meetingCategories: tags.map(
        tag =>
          ({
            category: { name: tag.value, companyId: 1 } as Category
          } as MeetingCategory)
      )
    }
    meetingStoreContext.create(meeting).then(() => {
      if (meetingStoreContext.meetingCreatedState === states.DONE) {
        setEvnets([
          ...events,
          {
            id: meeting.questionsSetId,
            title: meeting.name,
            date: meeting.startTime,
            color: 'red'
          } as EventInput
        ])

        window.setTimeout(() => {
          meetingStoreContext
            .fetchMeetings(
              (calViewProp as CalView).activeStart,
              (calViewProp as CalView).activeEnd
            )
            .then(() => {
              setEvnets(mapEvents(meetingStoreContext.meetings))
            })
        }, 1500)
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function clickOnEvent(event: any) {
    Router.push(`/meeting/${event.event.id}`)
  }

  const Seachbar = () => (
    <input
      type='search'
      name='search'
      id='search'
      placeholder='Søg efter navne på møder'
      value={searchWord}
      onChange={e => setSearchWord(e.target.value)}
      style={{ marginBottom: '10px' }}
    />
  )

  return (
    <Page title='Calendar' showBackButton={false} component={<Seachbar />}>
      <FullCalendarNoSSRWrapper
        trigger={e => console.log(e)}
        // viewHeight={5100}
        // header={false}
        header={{
          right: 'prev,next today myCustomButton',
          left: 'dayGridMonth,timeGridWeek,listWeek',
          center: 'title'
        }}
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
        //     click: () => toggle()
        //   }
        // }}
        defaultView='dayGridMonth'
        weekends
        events={events.filter(filterEvents)}
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

          {/* .fc-scroller {
            overflow: visible !important;
          } */}

          .fc-center h2 {
            font-size: 1.2em;
          }

          .fc-today-button {
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
          }


          .fc-left .fc-button-group{
            position: absolute;
            width: 100%;
          }

          .fc-left .fc-button-group button{
            border-radius: 0px;
          }

          .fc-left {
            padding-top: 50px;
          }

          .fc-header-toolbar {
            height: 80px;
          }
        
      `}</style>
    </Page>
  )
})

export default Calendar

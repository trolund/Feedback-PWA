import dynamic from 'next/dynamic'
import Router from 'next/router'
import React, { useContext, useState, useEffect, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { EventInput } from '@fullcalendar/core'
// import Modal from 'react-awesome-modal'
// import { X } from 'react-feather'
import Page from '../components/page'
import CalView from '../models/CalView'
// import questionSetStore from '../stores/QuestionSetStore'
import meetingStore from '../stores/MeetingStore'
import categoriesStore from '../stores/CategoriesStore'
// import MeetingCategory from '../models/MeetingCategory'
// import Category from '../models/Category'
import MeetingModel from '../models/MeetingModel'
// import FetchStates from '../stores/requestState'
// import Tag from '../models/tag'
// import CustomDatepicker from '../components/custom-datepicker'
// import CustomTimepicker from '../components/custom-timepicker'
import SearchBtn from '../components/search-btn'
import { getCompanyId } from '../services/authService'

let FullCalendarNoSSRWrapper

// const CreateMeetingModal = ({
//   modalOpen,
//   setModalOpen,
//   name,
//   setName,
//   discription,
//   setDiscription,
//   date,
//   setDate,
//   startTime,
//   setStartTime,
//   endTime,
//   setEndTime,
//   setQuestionSet,
//   questionContext,
//   createMeeting,
//   toggle
// }) => {
//   return (
//     <Modal
//       className='modal'
//       onClickAway={() => () => setModalOpen(false)}
//       visible={modalOpen}
//       // onAfterOpen={afterOpenModal}
//       // onRequestClose={closeModal}
//       // style={modalStyles}
//       contentLabel='Example Modal'
//     >
//       <h2>Opret møde</h2>
//       <button type='button' tabIndex={0} onClick={() => setModalOpen(false)}>
//         <X /> close
//       </button>
//       <input
//         type='text'
//         name='name'
//         id='name'
//         placeholder='Navn på mødet'
//         required
//         value={name}
//         onChange={e => setName(e.target.value)}
//       />
//       <input
//         type='textarea'
//         name='text'
//         id='exampleText'
//         value={discription}
//         onChange={e => setDiscription(e.target.value)}
//       />
//       <div style={{ marginBottom: '20px' }} className='flex-container'>
//         <div>
//           <label htmlFor='exampleText'>Dato</label>
//           <CustomDatepicker
//             value={date}
//             onChange={newDate => {
//               setDate(newDate)
//             }}
//           />
//         </div>
//         <div>
//           {' '}
//           <label htmlFor='exampleText'>Start tidspunkt</label>
//           <CustomTimepicker
//             value={startTime}
//             onChange={newTime => {
//               setStartTime(newTime)
//             }}
//           />
//         </div>
//         <div>
//           <label htmlFor='exampleText'>Slut tidspunkt</label>
//           <CustomTimepicker
//             value={endTime}
//             onChange={newTime => {
//               setEndTime(newTime)
//             }}
//           />
//         </div>
//       </div>
//       <select
//         name='select'
//         id='exampleSelect'
//         onChange={e => {
//           console.log(e.target)

//           setQuestionSet(e.target.value)
//         }}
//       >
//         <option>- Vælg spørgsmåls sæt -</option>
//         {questionContext.QSetNames.map(item => (
//           <option key={item.questionSetId} value={item.questionSetId}>
//             {item.name}
//           </option>
//         ))}
//       </select>
//       <button type='button' color='secondary' onClick={toggle}>
//         Fortryd
//       </button>
//       <button
//         type='button'
//         color='primary'
//         onClick={() => {
//           createMeeting()
//           toggle()
//         }}
//       >
//         Opret møde
//       </button>{' '}
//     </Modal>
//   )
// }

const CalendarView = observer(() => {
  // const questionContext = useContext(questionSetStore)
  const meetingStoreContext = useContext(meetingStore)
  const categoriesContext = useContext(categoriesStore)
  // const [modalOpen, setModalOpen] = useState(false)
  // const toggle = useCallback(() => setModalOpen(!modalOpen), [modalOpen])
  // const [date, setDate] = useState(new Date())
  // const [startTime, setStartTime] = useState(new Date())
  // const [endTime, setEndTime] = useState(new Date())
  // const [name, setName] = useState('')
  // const [discription, setDiscription] = useState('')
  // const [questionSet, setQuestionSet] = useState('')
  const [calViewProp, setCalViewProp] = useState({})
  const initEvent: EventInput[] = []
  const [events, setEvnets] = useState(initEvent)
  const [searchWord, setSearchWord] = useState('')
  // const init: Tag[] = []
  // const [tags, setTags] = useState(init)
  const [inputOpen, setInputOpen] = useState(false)

  const [showCal, setShowCal] = useState(false)

  useEffect(() => {
    FullCalendarNoSSRWrapper = dynamic({
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
    categoriesContext.fetchCategories(String(getCompanyId()))
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

  // const spliceDateAndTime = (datePart: Date, timePart: Date): Date => {
  //   datePart.setMinutes(timePart.getMinutes())
  //   datePart.setHours(timePart.getHours())
  //   datePart.setSeconds(0)
  //   return datePart
  // }

  // function createMeeting() {
  //   const meeting: MeetingModel = {
  //     discription,
  //     endTime: spliceDateAndTime(date, endTime),
  //     startTime: spliceDateAndTime(date, startTime),
  //     name,
  //     topic: 'emne',
  //     questionsSetId: questionSet,
  //     location: 'et sted',
  //     meetingCategories: tags.map(
  //       tag =>
  //         ({
  //           category: { name: tag.value, companyId: 1 } as Category
  //         } as MeetingCategory)
  //     )
  //   }
  //   meetingStoreContext.create(meeting).then(() => {
  //     if (meetingStoreContext.meetingCreatedState === states.DONE) {
  //       setEvnets([
  //         ...events,
  //         {
  //           id: meeting.questionsSetId,
  //           title: meeting.name,
  //           date: meeting.startTime,
  //           color: 'red'
  //         } as EventInput
  //       ])

  //       window.setTimeout(() => {
  //         meetingStoreContext
  //           .fetchMeetings(
  //             (calViewProp as CalView).activeStart,
  //             (calViewProp as CalView).activeEnd
  //           )
  //           .then(() => {
  //             setEvnets(mapEvents(meetingStoreContext.meetings))
  //           })
  //       }, 1500)
  //     }
  //   })
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  }, [events, filterEventsCallback, showCal])

  return (
    <Page
      title='Calendar'
      showBackButton={false}
      component={
        <SearchBtn
          inputOpen={inputOpen}
          setInputOpen={setInputOpen}
          searchWord={searchWord}
          setSearchWord={setSearchWord}
        />
      }
    >
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
      <div className='cal-container'>{showCalendar()}</div>

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
            height: calc(100% - 150px)
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

export default CalendarView

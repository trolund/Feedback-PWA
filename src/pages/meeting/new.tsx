/* eslint-disable func-names */
import { useState, useContext, useEffect } from './node_modules/react'
import { observer } from './node_modules/mobx-react-lite'
import { Save } from './node_modules/react-feather'
import CategoriesPicker from '../../components/categories-picker'
import Page from '../../components/page'
import Section from '../../components/section'
import questionSetStore from '../../stores/QuestionSetStore'
import meetingStore from '../../stores/MeetingStore'
import FetchStates from '../../stores/requestState'
import CustomDatepicker from '../../components/custom-datepicker'
import MeetingModel from '../../models/MeetingModel'
import CustomTimepicker from '../../components/custom-timepicker'
import MeetingCategory from '../../models/MeetingCategory'
import categoriesStore from '../../stores/CategoriesStore'
import OptionsValue from '../../models/OptionsValue'
import { getCompanyId } from '../../services/authService'
import withAuth from '../../services/withAuth'

const newMeetingPage = withAuth(
  observer(() => {
    const questionContext = useContext(questionSetStore)
    const categoriesContext = useContext(categoriesStore)
    const meetingStoreContext = useContext(meetingStore)
    const [meeting, setMeeting] = useState({} as MeetingModel)
    const [meetingCategories, setMeetingCategories] = useState([])
    const [date, setDate] = useState(new Date())
    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())
    const [questionSet, setQuestionSet] = useState('')
    //   const [tags, setTags] = useState([] as Tag[])

    useEffect(() => {
      categoriesContext.fetchCategories(String(getCompanyId())).then(() => {
        setMeetingCategories(categoriesContext.categories)
      })
    }, [categoriesContext])

    const spliceDateAndTime = (datePart: Date, timePart: Date): Date => {
      datePart.setMinutes(timePart.getMinutes())
      datePart.setHours(timePart.getHours())
      datePart.setSeconds(0)
      return datePart
    }

    const createMeeting = () => {
      const newMeeting: MeetingModel = {
        ...meeting,
        endTime: spliceDateAndTime(date, endTime),
        startTime: spliceDateAndTime(date, startTime),
        topic: 'emne',
        questionsSetId: questionSet,
        location: 'et sted'
      }
      meetingStoreContext.create(newMeeting)
      // meetingStoreContext.create(meeting).then(() => {
      //   if (meetingStoreContext.meetingCreatedState === states.DONE) {
      //     setEvnets([
      //       ...events,
      //       {
      //         id: meeting.questionsSetId,
      //         title: meeting.name,
      //         date: meeting.startTime,
      //         color: 'red'
      //       } as EventInput
      //     ])

      //     window.setTimeout(() => {
      //       meetingStoreContext
      //         .fetchMeetings(
      //           (calViewProp as CalView).activeStart,
      //           (calViewProp as CalView).activeEnd
      //         )
      //         .then(() => {
      //           setEvnets(mapEvents(meetingStoreContext.meetings))
      //         })
      //     }, 1500)
      //   }
      // })
    }

    return (
      <Page title={meeting?.name}>
        <Section>
          <div className='topbar'>
            <select
              name='select'
              id='exampleSelect'
              className='float-left'
              onChange={e => {
                setQuestionSet(e.target.value)
              }}
            >
              <option>- Vælg spørgsmåls sæt -</option>
              {questionContext.QSetNames?.map(item => (
                <option key={item.questionSetId} value={item.questionSetId}>
                  {item.name}
                </option>
              ))}
            </select>
            <button
              type='button'
              className='button float-right'
              color='primary'
              onClick={() => {
                createMeeting()
              }}
            >
              <Save
                style={{
                  height: '20px',
                  width: '20px',
                  marginRight: '7px',
                  marginTop: '2px'
                }}
              />
              Opret møde
            </button>
          </div>
          <input
            type='text'
            name='name'
            id='name'
            placeholder='Navn på mødet'
            required
            value={meeting?.name}
            onChange={e => setMeeting({ ...meeting, name: e.target.value })}
          />
          <CategoriesPicker
            loading={categoriesContext.state === FetchStates.LOADING}
            values={meeting.meetingCategories?.map(
              item =>
                ({
                  label:
                    meetingCategories?.filter(
                      i => i.categoryId === item.categoryId
                    )[0]?.name ?? 'Henter...',
                  value: item.categoryId
                } as OptionsValue)
            )}
            categories={categoriesContext?.categories}
            setTags={newTags =>
              setMeeting({
                ...meeting,
                meetingCategories: newTags?.map(
                  item =>
                    ({
                      meetingId: meeting.shortId,
                      categoryId: item.value,
                      name: item.label
                    } as MeetingCategory)
                )
              })
            }
          />
          <textarea
            value={meeting?.discription}
            placeholder='Kommentar'
            onChange={e =>
              setMeeting({ ...meeting, discription: e.target.value })
            }
          />
          <div style={{ marginBottom: '20px' }} className='flex-container'>
            <div>
              <p>Dato</p>
              <CustomDatepicker
                value={date}
                onChange={newDate => {
                  setDate(newDate)
                }}
              />
            </div>
            <div>
              {' '}
              <p>Start tidspunkt</p>
              <CustomTimepicker
                value={startTime}
                onChange={newTime => {
                  setStartTime(newTime)
                }}
              />
            </div>
            <div>
              <p>Slut tidspunkt</p>
              <CustomTimepicker
                value={endTime}
                onChange={newTime => {
                  setEndTime(newTime)
                }}
              />
            </div>
          </div>
        </Section>

        <style jsx>{`
          @media only screen and (max-width: 400px) {
            input {
              margin-right: auto;
              margin-left: auto;
              text-align: center;
              float: none;
            }

            .topbar {
              float: none;
            }
          }
          input {
            min-width: 100% !important;
          }

          textarea {
            margin-top: 25px !important;
            min-width: 100% !important;
            max-width: 100% !important;
          }

          #name {
            margin-bottom: 25px;
          }

          .topbar {
            width: 100%;
            padding: 10px;
            height: calc(2vw * 20);
            max-height: 120px;
          }
        `}</style>
      </Page>
    )
  })
)

export default newMeetingPage

/* eslint-disable func-names */
import { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Save } from 'react-feather'
import Router from 'next/router'
import CategoriesPicker from '../../components/categories-picker'
import Page from '../../components/page'
import Section from '../../components/section'
import FetchStates from '../../stores/requestState'
import CustomDatepicker from '../../components/custom-datepicker'
import MeetingModel from '../../models/MeetingModel'
import CustomTimepicker from '../../components/custom-timepicker'
import MeetingCategory from '../../models/MeetingCategory'
import OptionsValue from '../../models/OptionsValue'
import { getCompanyId } from '../../services/authService'
import withAuth from '../../services/withAuth'
import rootStore from '../../stores/RootStore'

const newMeetingPage = withAuth(
  observer(() => {
    // const questionContext = useContext(questionSetStore)
    // const categoriesContext = useContext(categoriesStore)
    // const meetingStoreContext = useContext(meetingStore)

    const { questionSetStore, categoriesStore, meetingStore } = useContext(
      rootStore
    )
    const [meeting, setMeeting] = useState({} as MeetingModel)
    const [meetingCategories, setMeetingCategories] = useState([])
    const [date, setDate] = useState(new Date())
    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())
    const [questionSet, setQuestionSet] = useState('')
    //   const [tags, setTags] = useState([] as Tag[])

    useEffect(() => {
      categoriesStore.fetchCategories(String(getCompanyId())).then(() => {
        setMeetingCategories(categoriesStore.categories)
      })
    }, [categoriesStore])

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
      meetingStore.create(newMeeting).then(res => {
        if (res === FetchStates.DONE) {
          Router.back()
        }
      })
    }

    return (
      <Page
        title='Nyt møde'
        showBottomNav={false}
        component={
          <button
            type='button'
            className=''
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
            Opret
          </button>
        }
      >
        <Section>
          <div className='topbar'>
            <div className='select-css'>
              <select
                name='select'
                onChange={e => {
                  setQuestionSet(e.target.value)
                }}
              >
                <option>- Vælg spørgsmåls sæt -</option>
                {questionSetStore.QSetNames?.map(item => (
                  <option key={item.questionSetId} value={item.questionSetId}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
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
            loading={categoriesStore.state === FetchStates.LOADING}
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
            categories={categoriesStore?.categories}
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

/* eslint-disable func-names */
import { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Save } from 'react-feather'
import CategoriesPicker from './categories-picker'
import FetchStates from '../stores/requestState'
import CustomDatepicker from './custom-datepicker'
import MeetingModel from '../models/MeetingModel'
import CustomTimepicker from './custom-timepicker'
import MeetingCategory from '../models/MeetingCategory'
import IOptionsValue from '../models/OptionsValue'
import { getCompanyId } from '../services/authService'
import rootStore from '../stores/RootStore'
import CustomSelect from './custom-select'
import { spliceDateAndTime } from '../services/dateService'
import CustomTextarea from './Input/custom-textarea'
import CustomInput from './custom-input'
import {
  validateTextInput,
  validateStartAndEndDate
} from '../services/validationService'

type AddMeetingProps = {
  callBack: () => void
  setShowModal: (show: boolean) => void
}

const AddMeeting = observer(({ callBack, setShowModal }: AddMeetingProps) => {
  const { questionSetStore, categoriesStore, meetingStore } = useContext(
    rootStore
  )
  const [meeting, setMeeting] = useState({} as MeetingModel)
  const [meetingCategories, setMeetingCategories] = useState([])
  const [date, setDate] = useState(new Date())
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [questionSet, setQuestionSet] = useState('')

  useEffect(() => {
    categoriesStore.fetchCategories(String(getCompanyId())).then(() => {
      setMeetingCategories(categoriesStore.categories)
    })
  }, [categoriesStore])

  const reset = () => {
    setMeeting({ name: '', discription: '' } as MeetingModel)
    setDate(new Date())
    setEndTime(new Date())
    setStartTime(new Date())
    setQuestionSet('')
    setMeetingCategories([])
  }

  const createMeeting = () => {
    const eTime = spliceDateAndTime(date, endTime)
    const newMeeting: MeetingModel = {
      ...meeting,
      endTime: eTime,
      startTime: spliceDateAndTime(date, startTime),
      topic: 'emne',
      questionsSetId: questionSet,
      location: 'et sted'
    }

    meetingStore.create(newMeeting).then(res => {
      if (res === FetchStates.DONE) {
        callBack()
        reset()
        setShowModal(false)
      }
    })
  }

  return (
    <div>
      <ul>
        <li>
          <h3>Opret møde</h3>
        </li>
        <li>
          <CustomSelect
            error={questionSet === 'null'}
            fill
            placeholder='- Vælg spørgsmåls sæt -'
            onChange={value => setQuestionSet(value)}
            values={
              questionSetStore.QSetNames
                ? questionSetStore.QSetNames.map(
                    q =>
                      ({
                        label: q.name,
                        value: q.questionSetId
                      } as IOptionsValue)
                  )
                : []
            }
          />
        </li>
        <li>
          <CustomInput
            fill
            error={validateTextInput(meeting?.name, 80, false).valid}
            type='text'
            placeholder='Navn på mødet'
            value={meeting?.name}
            onChange={e => setMeeting({ ...meeting, name: e })}
          />
        </li>
        <li>
          <CategoriesPicker
            fill
            loading={categoriesStore.state === FetchStates.LOADING}
            values={meeting.meetingCategories?.map(
              item =>
                ({
                  label:
                    meetingCategories?.filter(
                      i => i.categoryId === item.categoryId
                    )[0]?.name ?? 'Henter...',
                  value: item.categoryId
                } as IOptionsValue)
            )}
            categories={categoriesStore?.categories}
            setTags={newTags => {
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
            }}
          />
        </li>
        <li>
          <CustomTextarea
            fill
            error={validateTextInput(meeting?.name, 1500, true).valid}
            value={meeting?.discription}
            placeholder='Kommentar'
            onChange={e => setMeeting({ ...meeting, discription: e })}
          />
        </li>
        <li>
          <CustomDatepicker
            error={validateStartAndEndDate(date, new Date()).valid}
            value={date}
            onChange={newDate => {
              setDate(newDate)
            }}
          />
        </li>
        <li>
          <span>
            <p>Start tid</p>
            <CustomTimepicker
              error={validateStartAndEndDate(startTime, endTime).valid}
              value={startTime}
              onChange={newTime => {
                setStartTime(newTime)
              }}
            />
          </span>
          <span>
            <p>Slut tid</p>
            <CustomTimepicker
              error={validateStartAndEndDate(startTime, endTime).valid}
              value={endTime}
              onChange={newTime => {
                setEndTime(newTime)
              }}
            />
          </span>
        </li>
        <li>
          <button
            type='button'
            className='bottombtn button'
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
        </li>
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
            min-width: 100% !important;
            max-width: 100% !important;
          }

          .topbar {
            width: 100%;
            padding: 10px;
            height: calc(2vw * 20);
            max-height: 120px;
          }

          li {
            color: var(--fg);
            padding: var(--gap-small);
            display: flex;
            align-items: center;
            transition: var(--transition-colors);
          }

          li:not(:last-child) {
            border-bottom: 1px solid var(--divider);
          }
        `}</style>
      </ul>
    </div>
  )
})

export default AddMeeting

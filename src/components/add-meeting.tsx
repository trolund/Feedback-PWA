/* eslint-disable func-names */
import { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Save, X } from 'react-feather'
import { toast } from 'react-toastify'
import CategoriesPicker from './Input/categories-picker'
import FetchStates from '../stores/requestState'
import CustomDatepicker from './Input/custom-datepicker'
import MeetingModel from '../models/MeetingModel'
import CustomTimepicker from './Input/custom-timepicker'
import MeetingCategory from '../models/MeetingCategory'
import IOptionsValue from '../models/OptionsValue'
import { getCompanyId } from '../services/authService'
import rootStore from '../stores/RootStore'
import CustomSelect from './Input/custom-select'
import { spliceDateAndTime } from '../services/dateService'
import CustomTextarea from './Input/custom-textarea'
import CustomInput from './Input/custom-input'
import {
  validateTextInput,
  validateStartAndEndDate
} from '../services/validationService'
import { filterTempletes } from '../services/utilsService'

type AddMeetingProps = {
  callBack: () => void
  setShowModal: (show: boolean) => void
  initDate?: Date
}

const AddMeeting = observer(
  ({ callBack, setShowModal, initDate }: AddMeetingProps) => {
    const {
      questionSetStore,
      categoriesStore,
      meetingStore,
      settingStore: { hideTempQuestionSets }
    } = useContext(rootStore)
    const [meeting, setMeeting] = useState({} as MeetingModel)
    const [meetingCategories, setMeetingCategories] = useState([])
    const [date, setDate] = useState(initDate || new Date())
    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())
    const [questionSet, setQuestionSet] = useState('')
    const [showErrors, setShowErrors] = useState(false)
    const [Selecter, setSelecter] = useState('null')

    // errors
    const [timeError, setTimeError] = useState(false)

    useEffect(() => {
      if (initDate && initDate.toString() !== 'Invalid Date') {
        setDate(initDate)
      }
    }, [initDate])

    useEffect(() => {
      categoriesStore.fetchCategories(String(getCompanyId())).then(() => {
        setMeetingCategories(categoriesStore.categories)
      })
    }, [categoriesStore])

    const reset = () => {
      setMeeting({ name: '', discription: '' } as MeetingModel)
      setDate(initDate || new Date())
      setEndTime(new Date())
      setStartTime(new Date())
      setQuestionSet('')
      setMeetingCategories([])
      setSelecter('null')
    }

    const fuldformValid = (): boolean =>
      validateStartAndEndDate(startTime, endTime).valid &&
      validateTextInput(meeting?.name, 80, false).valid &&
      validateTextInput(meeting?.discription, 1500, true).valid &&
      questionSet === 'null'

    const createMeeting = () => {
      if (fuldformValid) {
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
            toast(`Mødet ${newMeeting.name} er nu oprettet.`)
          } else if (res === FetchStates.FAILED) {
            toast('Der skete en fejl ved oprettelsen af møde prøv igen')
          }
        })
      } else {
        setShowErrors(true)
        toast('Der skete en fejl ved oprettelsen af møde prøv igen')
      }
    }

    console.log(questionSet === 'null' || questionSet === '')

    return (
      <div>
        <span
          style={{
            position: 'absolute',
            right: '15px',
            padding: '10px',
            zIndex: 9999999
          }}
        >
          <X onClick={() => setShowModal(false)} />
        </span>
        <ul>
          <li>
            <h3>Opret møde</h3>
          </li>
          <li>
            <CustomSelect
              defaultValue={Selecter}
              error={questionSet === 'null' || questionSet === ''}
              fill
              placeholder='- Vælg spørgsmåls sæt -'
              onChange={value => setQuestionSet(value)}
              values={
                questionSetStore.QSetNames
                  ? questionSetStore.QSetNames.filter(
                      hideTempQuestionSets ? filterTempletes : () => true
                    ).map(
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
              error={
                validateTextInput(meeting?.name, 80, false).valid && showErrors
              }
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
              error={
                validateTextInput(meeting?.discription, 1500, true).valid &&
                showErrors
              }
              value={meeting?.discription}
              placeholder='Kommentar'
              onChange={e => setMeeting({ ...meeting, discription: e })}
            />
          </li>
          <li>
            <CustomDatepicker
              minValue={new Date()}
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
                maxValue={endTime}
                error={timeError}
                value={startTime}
                onChange={newTime => {
                  setStartTime(newTime)
                  setTimeError(!validateStartAndEndDate(newTime, endTime).valid)
                }}
              />
            </span>
            <span style={{ marginLeft: '10px' }}>
              <p>Slut tid</p>
              <CustomTimepicker
                minValue={startTime}
                error={timeError}
                value={endTime}
                onChange={newTime => {
                  setEndTime(newTime)
                  setTimeError(
                    !validateStartAndEndDate(startTime, newTime).valid
                  )
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
  }
)

export default AddMeeting

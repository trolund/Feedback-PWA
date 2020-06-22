import { useState, useContext, useEffect, useCallback } from 'react'
import { observer } from 'mobx-react'
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
  optemistik?: (meeting: MeetingModel) => void
  setShowModal: (show: boolean) => void
  initDate?: Date
}

const AddMeeting = observer(
  ({ callBack, setShowModal, initDate, optemistik }: AddMeetingProps) => {
    const {
      questionSetStore: { fetchQuestionSetNames, QSetNames },
      categoriesStore: { fetchCategories, fetchState: state, categories },
      meetingStore,
      settingStore: { hideTempQuestionSets }
    } = useContext(rootStore)
    const [meeting, setMeeting] = useState({} as MeetingModel)

    // const getMeetingCategories = () =>
    //   categories?.map(
    //     item =>
    //       ({
    //         label:
    //           categories?.filter(i => i.categoryId === item.categoryId)[0]
    //             ?.name ?? 'Henter...',
    //         value: item.categoryId
    //       } as IOptionsValue)
    //   )

    // const [meetingCategories, setMeetingCategories] = useState(
    //   getMeetingCategories()
    // )
    const [date, setDate] = useState(initDate || new Date())
    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())
    const [questionSet, setQuestionSet] = useState('null')
    const [showErrors, setShowErrors] = useState(false)
    //  const [Selecter, setSelecter] = useState('null')

    // errors
    const [timeError, setTimeError] = useState(false)

    const minDate = () => {
      const d = new Date()
      d.setHours(0)
      d.setMinutes(1)
      d.setSeconds(1)

      return d
    }

    const maxDate = () => {
      const d = new Date()
      d.setHours(23)
      d.setMinutes(59)
      d.setSeconds(59)

      return d
    }

    useEffect(() => {
      if (initDate && initDate.toString() !== 'Invalid Date') {
        setDate(initDate)
      }
    }, [initDate])

    useEffect(() => {
      fetchCategories(String(getCompanyId()))
      fetchQuestionSetNames()
    }, [])

    // useEffect(() => {
    //   const newVal = getMeetingCategories()
    //   if (newVal) setMeetingCategories([...newVal])
    // }, [meeting, categories])

    const reset = () => {
      setMeeting({
        name: '',
        discription: '',
        meetingCategories: []
      } as MeetingModel)
      setDate(initDate || new Date())
      setEndTime(new Date())
      setStartTime(new Date())
      setQuestionSet('null')
    }

    const fuldformValid = (): boolean =>
      validateStartAndEndDate(startTime, endTime).valid &&
      validateTextInput(meeting?.name, 80, false).valid &&
      validateTextInput(meeting?.discription, 1500, true).valid &&
      questionSet !== 'null'

    const createMeeting = () => {
      if (fuldformValid()) {
        const eTime = spliceDateAndTime(date, endTime)
        const sTime = spliceDateAndTime(date, startTime)
        const newMeeting: MeetingModel = {
          ...meeting,
          endTime: eTime,
          startTime: sTime,
          topic: 'emne',
          questionsSetId: questionSet,
          location: 'et sted'
        }
        setShowErrors(false)

        meetingStore.create(newMeeting).then(res => {
          if (res === FetchStates.DONE) {
            if (optemistik) optemistik(newMeeting)
            reset()
            setShowModal(false)
            toast(`Mødet ${newMeeting.name} er nu oprettet.`)
            callBack()
          } else if (res === FetchStates.FAILED) {
            toast('Der skete en fejl ved oprettelsen af møde prøv igen')
          }
        })
      } else {
        setShowErrors(true)
        toast('Der skete en fejl ved oprettelsen af møde prøv igen')
      }
    }

    // const minDate = () => {
    //   const d = new Date()
    //   d.setSeconds(0)
    //   d.setMinutes(0)
    //   d.setHours(0)

    //   return d
    // }

    // const maxDateTime = useCallback(() => {
    //   const d = new Date(date)
    //   d.setSeconds(59)
    //   d.setMinutes(59)
    //   d.setHours(23)

    //   return d
    // }, [date])

    // const minDateTime = useCallback(() => {
    //   const d = new Date(date)
    //   d.setSeconds(0)
    //   d.setMinutes(1)
    //   d.setHours(0)

    //   return d
    // }, [date])

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
          <li className='modal-header'>
            <h3>Opret møde</h3>
          </li>
          <li data-cy='questionset-selector'>
            <CustomSelect
              error={questionSet == 'null' && showErrors}
              defaultValue={questionSet}
              fill
              placeholder='- Vælg spørgsmålssæt -'
              onChange={value => {
                setQuestionSet(value)
              }}
              values={
                QSetNames
                  ? QSetNames.filter(
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
          <li data-cy='meeting-name'>
            <CustomInput
              fill
              error={
                !validateTextInput(meeting?.name, 80, false).valid && showErrors
              }
              type='text'
              placeholder='Navn på mødet'
              value={meeting?.name}
              onChange={e => setMeeting({ ...meeting, name: e })}
            />
          </li>
          <li data-cy='categories-selector'>
            <CategoriesPicker
              fill
              loading={state === FetchStates.LOADING}
              values={meeting.meetingCategories?.map(
                item =>
                  ({
                    label:
                      categories?.filter(
                        i => i.categoryId === item.categoryId
                      )[0]?.name ?? 'Henter...',
                    value: item.categoryId
                  } as IOptionsValue)
              )}
              categories={categories || []}
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
          <li data-cy='comment'>
            <CustomTextarea
              fill
              error={
                !validateTextInput(meeting?.discription, 1500, true).valid &&
                showErrors
              }
              value={meeting?.discription}
              placeholder='Kommentar'
              onChange={e => setMeeting({ ...meeting, discription: e })}
            />
          </li>
          <li data-cy='meeting-date'>
            <CustomDatepicker
              minValue={minDate()}
              error={validateStartAndEndDate(date, new Date()).valid}
              value={date}
              onChange={newDate => {
                setDate(newDate)
              }}
            />
          </li>
          <li>
            <span data-cy='meeting-start-time'>
              <p>Start tid</p>
              <CustomTimepicker
                minValue={minDate()}
                maxValue={maxDate()}
                error={
                  !validateStartAndEndDate(startTime, endTime).valid &&
                  showErrors
                }
                value={startTime}
                onChange={newTime => {
                  setStartTime(newTime)
                  // setTimeError(!validateStartAndEndDate(newTime, endTime).valid)
                }}
              />
            </span>
            <span style={{ marginLeft: '10px' }} data-cy='meeting-end-time'>
              <p>Slut tid</p>
              <CustomTimepicker
                minValue={startTime}
                maxValue={maxDate()}
                error={
                  !validateStartAndEndDate(startTime, endTime).valid &&
                  showErrors
                }
                value={endTime}
                onChange={newTime => {
                  setEndTime(newTime)
                  // setTimeError(
                  //   !validateStartAndEndDate(startTime, newTime).valid
                  // )
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
              data-cy='create-meeting-btn'
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

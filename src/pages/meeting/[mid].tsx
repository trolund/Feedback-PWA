import { useContext, useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import Router from 'next/router'
import { observer } from 'mobx-react'
import { QRCode } from 'react-qr-svg'
import { Save, Trash } from 'react-feather'
import { NextPage } from 'next'
import { toast } from 'react-toastify'
import { HubConnectionBuilder, HubConnectionState } from '@aspnet/signalr'
import Page from '../../components/essentials/page'
import Section from '../../components/essentials/section'
import FeedbackView from '../../components/feedback/feedback'
import Feedback from '../../models/Feedback'
import ApiRoutes from '../../stores/api/ApiRoutes'
import FetchStates from '../../stores/requestState'
import CustomDatepicker from '../../components/Input/custom-datepicker'
import CustomTimepicker from '../../components/Input/custom-timepicker'
import CategoriesPicker from '../../components/Input/categories-picker'
import FeedbackBatch from '../../models/FeedbackBatch'
import MeetingCategory from '../../models/MeetingCategory'
import IOptionsValue from '../../models/OptionsValue'
import { getCompanyId, getToken } from '../../services/authService'
import rootStore from '../../stores/RootStore'
import { applyOffSet, spliceDateAndTime } from '../../services/dateService'
import CustomConfirmModal from '../../components/essentials/confirm-modal'
import withAuth from '../../components/hoc/withAuth'
import MiddelLoader from '../../components/essentials/middelLoading'
import {
  validateStartAndEndDate,
  validateTextInput
} from '../../services/validationService'

const Post: NextPage = observer(() => {
  const router = useRouter()
  const { mid } = router.query
  const [showErrors, setshowErrors] = useState(false)

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

  const hubConnection = new HubConnectionBuilder()
    .withUrl(ApiRoutes.liveFeedback, {
      accessTokenFactory: getToken
    })
    .build()

  const {
    questionSetStore: { fetchQuestionSet, qSet, setQSet },
    feedbackStore: {
      fetchFeedback,
      fetchState: FeedbackFetchState,
      feedbackBatch,
      setFeedbackBatch
    },
    meetingStore: {
      deleteMeeting,
      update,
      fetchState: state,
      meeting,
      setMeeting,
      fetchMeetingByShortId
    },
    categoriesStore: { fetchCategories, categories, fetchState: catFetchState },
    settingStore: { realtimeFeedbackDefault }
  } = useContext(rootStore)

  // go back if meeting is not loaded
  useEffect(() => {
    if (state === FetchStates.FAILED) {
      Router.back()
    }
  }, [state])

  useEffect(() => {
    fetchCategories(String(getCompanyId()))
  }, [getCompanyId])

  useEffect(() => {
    fetchMeetingByShortId(String(mid))
    fetchFeedback(String(mid))
  }, [mid])

  // const [meeting, setMeeting] = useState(null)
  // const [meetingCategories] = useState(null)
  const [isRealTimeDateOn, setRealTimeDateOn] = useState(
    realtimeFeedbackDefault
  )
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const getMeetingCategories = () =>
    meeting?.meetingCategories.map(
      item =>
        ({
          label:
            categories?.filter(i => i.categoryId === item.categoryId)[0]
              ?.name ?? 'Henter...',
          value: item.categoryId
        } as IOptionsValue)
    )

  const [meetingCategories, setMeetingCategories] = useState(
    getMeetingCategories()
  )

  useEffect(() => {
    const newVal = getMeetingCategories()
    if (newVal) setMeetingCategories([...newVal])
  }, [meeting, categories])

  // useEffect(() => {
  //   if (meeting) {
  //     setDate(new Date(meeting?.startTime))
  //     setStartTime(new Date(meeting?.startTime))
  //     setEndTime(new Date(meeting?.endTime))
  //   }
  // }, [meeting])

  // const [date, setDate] = useState(new Date())
  // const [startTime, setStartTime] = useState(new Date())
  // const [endTime, setEndTime] = useState(new Date())

  const joinMeetingRoom = useCallback(() => {
    hubConnection
      .invoke('JoinRoom', String(mid))
      .then(() => console.log(`joind room ${mid}`))
      .catch(err => console.error(err))
  }, [hubConnection, mid])

  const leaveMeetingRoom = useCallback(() => {
    if (hubConnection.state === HubConnectionState.Connected) {
      hubConnection
        .invoke('LeaveRoom', String(mid))
        .then(() => {
          console.log(`leaved room ${mid}`)
          hubConnection.stop().catch(err => console.error(err))
          console.log(`real-time feedback connection closed.`)
        })
        .catch(err => console.error(err))
    }
  }, [hubConnection, mid])

  const subscripeToEvents = useCallback(() => {
    hubConnection.on('sendfeedback', (data: FeedbackBatch[]) => {
      setFeedbackBatch(data)
    })
    hubConnection.on('memberJoind', data => {
      console.log('Join', data)
    })
  }, [hubConnection])

  const openConnection = useCallback(() => {
    hubConnection.start().then(() => {
      joinMeetingRoom()
      subscripeToEvents()
    })
  }, [hubConnection, joinMeetingRoom, subscripeToEvents])

  const closeConnection = useCallback(() => {
    if (hubConnection.state === HubConnectionState.Connected) {
      hubConnection.off('sendfeedback')
      hubConnection.off('memberJoind')
      leaveMeetingRoom()
    }
  }, [hubConnection, leaveMeetingRoom])

  useEffect(() => {
    if (isRealTimeDateOn) {
      openConnection()
    } else {
      closeConnection()
    }
    return () => {
      closeConnection()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRealTimeDateOn])

  useEffect(() => {
    if (meeting?.questionsSetId && qSet === null) {
      fetchQuestionSet(meeting?.questionsSetId)
    }
  }, [meeting])

  const count = useCallback(() => (feedbackBatch ? feedbackBatch?.length : 0), [
    feedbackBatch
  ])()

  useEffect(() => {
    return () => {
      setQSet(null)
    }
  }, [])

  const fuldformValid = (): boolean =>
    validateStartAndEndDate(meeting?.startTime, meeting?.endTime).valid &&
    validateTextInput(meeting?.name, 80, false).valid &&
    validateTextInput(meeting?.discription, 1500, true).valid

  const updateMeetingClickHandler = () => {
    if (meeting && fuldformValid()) {
      update(meeting).then(res => {
        if (res === FetchStates.DONE) {
          toast('Møde er opdateret!')
          fetchMeetingByShortId(String(mid))
        } else toast('Der skete en fejl ved Opdatering af mødet.')
      })
    } else {
      setshowErrors(true)
      toast('Data inputet overholder ikke regler.')
    }
  }

  const deleteMeetingClickHandler = () => {
    if (meeting) {
      deleteMeeting(meeting).then(r => {
        if (r === FetchStates.DONE) {
          toast('Møde er slettet!')
          Router.back()
        } else if (r === FetchStates.FAILED) {
          toast('Der skete en fejl ved sletning af mødet.')
        }
      })
    }
  }

  return (
    <>
      <MiddelLoader loading={state === FetchStates.LOADING} />
      <Page
        showBottomNav={false}
        title={meeting?.name ?? 'loading...'}
        showBackButton
        component={
          <Save
            onClick={updateMeetingClickHandler}
            style={{
              height: '20px',
              width: '20px',
              marginRight: '7px'
            }}
          />
        }
      >
        <CustomConfirmModal
          titel='Bekræft sletning'
          onConfirm={deleteMeetingClickHandler}
          setShow={setShowConfirmModal}
          show={showConfirmModal}
          content={
            <p>Er du sikker på du vil slette mødet {meeting?.name || ''}.</p>
          }
        />
        <Section>
          <div className='flex-container'>
            <div className='flex-item-left'>
              <form>
                <ul className='basic-list'>
                  <li>
                    <label htmlFor='id'>ID</label>
                    <h2 data-cy='meetingId' style={{ paddingBottom: '10px' }}>
                      {String(mid)}
                    </h2>
                  </li>
                  <li>
                    <label data-cy='questionSet' htmlFor='questionSet'>
                      Spørgsmål sæt
                    </label>
                    <p
                      id='questionSet'
                      style={{
                        margin: 0,
                        color: qSet ? 'var(--text)' : 'var(--label)'
                      }}
                    >
                      {qSet?.name || ' Spørgsmålssæt'}
                    </p>
                  </li>
                  <li>
                    <label htmlFor='name'>Aktivitetsnavn</label>
                    <input
                      data-cy='eventName'
                      type='text'
                      name='name'
                      id='name'
                      placeholder='Navn på mødet'
                      value={meeting?.name || ''}
                      onChange={e =>
                        setMeeting({ ...meeting, name: e.target.value })
                      }
                    />
                  </li>
                  <li>
                    <label htmlFor='exampleText'>Beskrivelse</label>
                    <textarea
                      data-cy='discription'
                      name='text'
                      id='exampleText'
                      value={meeting?.discription}
                      onChange={e =>
                        setMeeting({ ...meeting, discription: e.target.value })
                      }
                    />
                  </li>
                  <li>
                    <div className='flex-container'>
                      <div className='date'>
                        <label htmlFor='exampleText'>Dato</label>
                        <CustomDatepicker
                          value={meeting?.startTime || new Date()}
                          onChange={newDate => {
                            setMeeting({
                              ...meeting,
                              endTime: spliceDateAndTime(
                                applyOffSet(newDate),
                                meeting.endTime
                              ),
                              startTime: spliceDateAndTime(
                                applyOffSet(newDate),
                                meeting.startTime
                              )
                            })
                          }}
                        />
                      </div>
                      <div className='times'>
                        <div>
                          <label htmlFor='exampleText'>Start tidspunkt</label>
                          <CustomTimepicker
                            error={
                              !validateStartAndEndDate(
                                meeting?.startTime || new Date(),
                                meeting?.endTime || new Date()
                              ).valid && showErrors
                            }
                            minValue={minDate()}
                            maxValue={maxDate()}
                            value={meeting?.startTime || new Date()}
                            onChange={newTime => {
                              setMeeting({
                                ...meeting,
                                startTime: newTime
                              })
                            }}
                          />
                        </div>
                        <div>
                          <label htmlFor='exampleText'>Slut tidspunkt</label>
                          <CustomTimepicker
                            error={
                              !validateStartAndEndDate(
                                meeting?.startTime || new Date(),
                                meeting?.endTime || new Date()
                              ).valid && showErrors
                            }
                            minValue={minDate()}
                            maxValue={maxDate()}
                            value={meeting?.endTime || new Date()}
                            onChange={newTime => {
                              setMeeting({
                                ...meeting,
                                endTime: newTime
                              })
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <CategoriesPicker
                      fill
                      loading={catFetchState === FetchStates.LOADING}
                      values={meetingCategories}
                      categories={categories}
                      setTags={tags =>
                        setMeeting({
                          ...meeting,
                          meetingCategories: tags.map(
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
                  </li>
                </ul>
              </form>
              <hr />
              <FeedbackView
                // feedback={feedback()}
                // count={count}
                feedbackLoading={FeedbackFetchState}
                isRealtime={isRealTimeDateOn}
                setIsRealtime={setRealTimeDateOn}
              />
              {count === 0 && (
                <div style={{ width: '100%', padding: '10px' }}>
                  <button
                    data-cy='meeting-delete'
                    type='button'
                    className='button bottombtn'
                    onClick={() => setShowConfirmModal(true)}
                  >
                    <Trash
                      style={{
                        height: '20px',
                        width: '20px',
                        marginRight: '-20px',
                        marginTop: '2px',
                        float: 'left'
                      }}
                    />
                    Slet
                  </button>
                </div>
              )}
            </div>
            <div className='flex-item-right center'>
              <div className='qrbox'>
                <h4>QRkode</h4>
                {ApiRoutes.qrcode(String(mid)).includes('http') ? (
                  <QRCode
                    bgColor='var(--surface)'
                    fgColor='var(--accent)'
                    level='L'
                    style={{ width: 256 }}
                    value={ApiRoutes.qrcode(String(mid))}
                  />
                ) : (
                  <p>Loading....</p>
                )}
                <p>
                  Brug denne unikke QR kode til let at give dine deltagere
                  adgang til at give dig tilbagemeldinger. Kopier evt billede
                  ind i et slideshow eller brug dette link
                  <a
                    href={ApiRoutes.qrcode(String(mid))}
                    style={{ fontWeight: 700 }}
                    data-cy='feedback-link'
                  >
                    {' '}
                    {ApiRoutes.qrcode(String(mid)).split('/')[4]}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Section>

        {state === FetchStates.LOADING && <p>loading</p>}
        {state === FetchStates.FAILED && (
          <div className='center'>
            <b>404</b>
            <p>
              Mødet med id <b>{mid}</b> er ikke fundet.
            </p>
          </div>
        )}

        <style jsx>{`
          @media only screen and (max-width: 600px) {
            .flex-container {
              justify-content: left;
            }
          }

          label {
            display: none;
          }

          .btn-group {
            height: 60px;
            text-align: right;
          }

          .no-border {
            border: none;
          }

          .btn-group button {
            margin-left: 5px;
          }
          .qrimg {
            max-width: 170px;
            max-height: 1670px;
          }
          .date {
            margin-top: var(--gap-small);
            margin-right: var(--gap-small);
          }

          .times {
            margin-top: var(--gap-small);
            display: flex;
          }

          .times > div:last-child {
            margin-left: var(--gap-small);
          }

          .qrbox {
            float: right;
            border: solid rgb(193, 204, 218) 1px;
            border-radius: var(--border-radius);
            padding: 15px;
          }

          .qrbox p {
            font-style: italic;
            font-size: 1rem;
          }

          textarea {
            min-width: 100%;
            max-width: 100%;
            min-height: 100px;
          }
          input {
            min-width: 100%;
          }
          .flex-item-right {
            flex: 1 auto;
            padding: 5px;
            min-width: 250px;
            max-width: 320px;
            margin-top: 10px;
            text-align: center;
          }
          .flex-item-left {
            flex-grow: 1;
            padding: 5px;
            min-width: 50%;
            width: 600px;
            margin-top: 10px;
          }
        `}</style>
      </Page>
    </>
  )
})

// Post.getInitialProps = async (ctx: NextPageContext) => {
//   const { token } = cookies(ctx)
//   const { query } = ctx
//   const { mid } = query

//   const options = {
//     agent: new https.Agent({
//       rejectUnauthorized: false // TODO fix for production with real SSL CERT
//     })
//   }
//   let data: MeetingModel | null = null

//   let feedbackData: FeedbackBatch[] | null = null
//   let CategoriesData: Category[] | null = null
//   try {
//     const response = await fetch(ApiRoutes.meetingByShortId(String(mid)), {
//       headers: !token ? {} : { Authorization: `Bearer ${token}` },
//       ...options
//     })
//     data = await response.json()
//     const feedbackResponse = await fetch(ApiRoutes.Feedbackbatch(String(mid)), {
//       headers: !token ? {} : { Authorization: `Bearer ${token}` },
//       ...options
//     })
//     feedbackData = await feedbackResponse.json()

//     const responseCategories = await fetch(
//       ApiRoutes.Categories(String(getCompanyId(token))),
//       {
//         headers: !token ? {} : { Authorization: `Bearer ${token}` },
//         ...options
//       }
//     )
//     CategoriesData = await responseCategories.json()
//   } catch (e) {
//     console.error(e)
//   }

//   return {
//     props: {
//       initMeeting: data,
//       intitFeedback: feedbackData,
//       initCategories: CategoriesData
//     }
//   }
// }

export default withAuth(Post)

/* eslint-disable import/no-duplicates */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useContext, useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import Router from 'next/router'
import { observer } from 'mobx-react-lite'
import { QRCode } from 'react-qr-svg'
import { Save, Trash } from 'react-feather'
import { NextPage, NextPageContext } from 'next'
import cookies from 'next-cookies'
import fetch from 'isomorphic-unfetch'
import { toast } from 'react-toastify'
import { HubConnectionBuilder, HubConnectionState } from '@aspnet/signalr'
import https from 'https'
import Page from '../../components/page'
import Section from '../../components/section'
import FeedbackView from '../../components/feedback'
import Feedback from '../../models/Feedback'
import ApiRoutes from '../../stores/api/ApiRoutes'
import FetchStates from '../../stores/requestState'
import CustomDatepicker from '../../components/custom-datepicker'
import CustomTimepicker from '../../components/custom-timepicker'
import CategoriesPicker from '../../components/categories-picker'
import MeetingModel from '../../models/MeetingModel'
import FeedbackBatch from '../../models/FeedbackBatch'
import CustomToast from '../../components/custom-Toast'
import MeetingCategory from '../../models/MeetingCategory'
import IOptionsValue from '../../models/OptionsValue'
import { getCompanyId, getToken } from '../../services/authService'
import Category from '../../models/Category'
import rootStore from '../../stores/RootStore'
import {
  applyOffSetToMeeting,
  spliceDateAndTime
} from '../../services/dateService'

type initMeetingProps = {
  initMeeting: MeetingModel
  intitFeedback: FeedbackBatch[]
  initCategories: Category[]
}

const Post: NextPage = observer(
  ({ initMeeting, intitFeedback, initCategories }: initMeetingProps) => {
    const router = useRouter()
    const { mid } = router.query

    const hubConnection = new HubConnectionBuilder()
      .withUrl(ApiRoutes.liveFeedback, {
        accessTokenFactory: getToken
      })
      .build()

    const [feedbackBatch, setFeedbackBatch] = useState(intitFeedback)
    const {
      questionSetStore,
      feedbackStore,
      meetingStore: { deleteMeeting, update, state },
      categoriesStore
    } = useContext(rootStore)

    const [meeting, setMeeting] = useState(initMeeting)
    const [meetingCategories] = useState(initCategories)
    const [isRealTimeDateOn, setRealTimeDateOn] = useState(false)

    useEffect(() => {
      setMeeting(applyOffSetToMeeting(initMeeting))
    }, [initMeeting])

    const [date, setDate] = useState(new Date())
    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())

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
          .then(() => console.log(`leaved room ${mid}`))
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
        hubConnection.stop()
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
      if (meeting) {
        setDate(new Date(meeting?.startTime))
        setStartTime(new Date(meeting?.startTime))
        setEndTime(new Date(meeting?.endTime))
      }
    }, [meeting])

    useEffect(() => {
      if (meeting?.questionsSetId)
        questionSetStore.fetchQuestionSet(meeting?.questionsSetId)
    }, [meeting, questionSetStore])

    const count = useCallback(
      () => (feedbackBatch ? feedbackBatch?.length : 0),
      [feedbackBatch]
    )()

    const getAvg = useCallback(
      (questionId: string) => {
        const returnAvg = feedbackBatch
          ?.map(i => i.feedback)
          .flat()
          .filter(x => x.questionId === questionId)
          .reduce((avg, item, _, { length }) => {
            return avg + item.answer / length
          }, 0)

        return returnAvg || 0
      },
      [feedbackBatch]
    )

    const getComments = useCallback(
      (questionId: string) => {
        return feedbackBatch
          ?.map(batch =>
            batch.feedback.map(feed =>
              feed.questionId === questionId ? feed.comment : null
            )
          )
          .flat()
          .filter(s => s !== null)
          .filter(s => s?.length! > 1)
      },
      [feedbackBatch]
    )

    const feedback = useCallback(() => {
      const { qSet } = questionSetStore

      const theFeedback = qSet?.questions.map(item => {
        return {
          question: item.theQuestion,
          comments: getComments(item.questionId),
          voteAVG: getAvg(item.questionId)
        } as Feedback
      })
      return theFeedback || []
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getAvg, getComments, questionSetStore])

    const updateMeetingClickHandler = () => {
      if (meeting) {
        setMeeting({
          ...meeting,
          endTime: spliceDateAndTime(date, endTime),
          startTime: spliceDateAndTime(date, startTime)
        } as MeetingModel)
        update(meeting).then(res => {
          if (res === FetchStates.DONE) toast('Møde er updateret!')
          else toast('Der skete en fejl ved updatering af mødet.')
        })
      }
    }

    const deleteMeetingClickHandler = () => {
      if (meeting) {
        deleteMeeting(meeting)
        toast('Møde er slettet!')
        Router.back()
      }
    }
    return (
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
        <Section>
          <div className='flex-container'>
            <div className='flex-item-left'>
              {' '}
              <form>
                <label htmlFor='id'>Id</label>
                <input
                  type='text'
                  name='id'
                  id='id'
                  placeholder='ID'
                  value={mid}
                  disabled
                />
                <label htmlFor='name'>Møde navn</label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  placeholder='Navn på mødet'
                  value={meeting?.name}
                  onChange={e =>
                    setMeeting({ ...meeting, name: e.target.value })
                  }
                />
                <label htmlFor='exampleText'>Beskrivelse</label>
                <textarea
                  name='text'
                  id='exampleText'
                  value={meeting?.discription}
                  onChange={e =>
                    setMeeting({ ...meeting, discription: e.target.value })
                  }
                />
                <div
                  style={{ marginBottom: '20px' }}
                  className='flex-container'
                >
                  <div>
                    <label htmlFor='exampleText'>Dato</label>
                    <CustomDatepicker
                      value={date}
                      onChange={newDate => {
                        setDate(newDate)
                      }}
                    />
                  </div>
                  <div>
                    {' '}
                    <label htmlFor='exampleText'>Start tidspunkt</label>
                    <CustomTimepicker
                      value={startTime}
                      onChange={newTime => {
                        setStartTime(newTime)
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='exampleText'>Slut tidspunkt</label>
                    <CustomTimepicker
                      value={endTime}
                      onChange={newTime => {
                        setEndTime(newTime)
                      }}
                    />
                  </div>
                </div>
                <CategoriesPicker
                  fill
                  loading={categoriesStore.state === FetchStates.LOADING}
                  values={meeting?.meetingCategories.map(
                    item =>
                      ({
                        label:
                          meetingCategories?.filter(
                            i => i.categoryId === item.categoryId
                          )[0]?.name ?? 'Henter...',
                        value: item.categoryId
                      } as IOptionsValue)
                  )}
                  categories={meetingCategories}
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
              </form>
              <hr />
              <FeedbackView
                feedback={feedback()}
                count={count}
                feedbackLoading={feedbackStore.state}
                isRealtime={isRealTimeDateOn}
                setIsRealtime={setRealTimeDateOn}
              />
              <div style={{ width: '100%', padding: '10px' }}>
                <button
                  type='button'
                  className='button bottombtn'
                  onClick={deleteMeetingClickHandler}
                >
                  <Trash
                    style={{
                      height: '20px',
                      width: '20px',
                      marginRight: '7px',
                      marginTop: '2px'
                    }}
                  />
                  Slet
                </button>
              </div>
            </div>
            <div className='flex-item-right'>
              <div className='qrbox'>
                <h4>Qrkode</h4>
                <QRCode
                  bgColor='var(--surface)'
                  fgColor='var(--accent)'
                  level='Q'
                  style={{ width: 256 }}
                  value={ApiRoutes.qrcode(String(mid))}
                />
                <p>
                  Brug denne unikke qrkode til let at give dine deltagere adgang
                  til at give dig feedback. kopier evt billede ind i et slide
                  show eller hav denne side klar. eller brug{' '}
                  <a href={ApiRoutes.qrcode(String(mid))}>
                    {ApiRoutes.qrcode(String(mid))}
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

          .qrbox {
            float: right;
            border: solid rgb(193, 204, 218) 1px;
            border-radius: 5px;
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
        <CustomToast />
      </Page>
    )
  }
)

export async function getServerSideProps(ctx: NextPageContext) {
  const { token } = cookies(ctx)
  const { query } = ctx
  const { mid } = query

  const options = {
    agent: new https.Agent({
      rejectUnauthorized: false // TODO fix for production with real SSL CERT
    })
  }
  let data: MeetingModel | null = null

  let feedbackData: FeedbackBatch[] | null = null
  let CategoriesData: Category[] | null = null
  try {
    const response = await fetch(ApiRoutes.meetingByShortId(String(mid)), {
      headers: !token ? {} : { Authorization: `Bearer ${token}` },
      ...options
    })
    data = await response.json()
    const feedbackResponse = await fetch(ApiRoutes.Feedbackbatch(String(mid)), {
      headers: !token ? {} : { Authorization: `Bearer ${token}` },
      ...options
    })
    feedbackData = await feedbackResponse.json()
    console.log(feedbackData)

    const responseCategories = await fetch(
      ApiRoutes.Categories(String(getCompanyId(token))),
      {
        headers: !token ? {} : { Authorization: `Bearer ${token}` },
        ...options
      }
    )
    CategoriesData = await responseCategories.json()
  } catch (e) {
    console.error(e)
  }

  return {
    props: {
      initMeeting: data,
      intitFeedback: feedbackData,
      initCategories: CategoriesData
    }
  }
}

export default Post

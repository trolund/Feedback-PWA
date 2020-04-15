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
import Page from '../../components/page'
import Section from '../../components/section'
import meetingStore from '../../stores/MeetingStore'
import feedbackStore from '../../stores/FeedbackStore'
import questionSetStore from '../../stores/QuestionSetStore'
import FeedbackView from '../../components/feedback'
import Feedback from '../../models/Feedback'
import ApiRoutes from '../../stores/api/ApiRoutes'
import FetchStates from '../../stores/requestState'
import CustomDatepicker from '../../components/custom-datepicker'
import CustomTimepicker from '../../components/custom-timepicker'
import CategoriesPicker from '../../components/categories-picker'
import categoriesStore from '../../stores/CategoriesStore'
import MeetingModel from '../../models/MeetingModel'
import FeedbackBatch from '../../models/FeedbackBatch'
import CustomToast from '../../components/custom-Toast'
import MeetingCategory from '../../models/MeetingCategory'
import OptionsValue from '../../models/OptionsValue'
import { getCompanyId } from '../../services/authService'
import Category from '../../models/Category'

// import categoriesStore from '../../stores/CategoriesStore'

type initMeetingProps = {
  initMeeting: MeetingModel
  intitFeedback: FeedbackBatch[]
  initCategories: Category[]
}

const Post: NextPage = observer(
  ({ initMeeting, intitFeedback, initCategories }: initMeetingProps) => {
    const router = useRouter()
    const { mid } = router.query
    // const qr = new QRCode()

    const { deleteMeeting, update, state } = useContext(meetingStore)
    const [feedbackBatch] = useState(intitFeedback)
    const feedbackcontext = useContext(feedbackStore)
    const questionSetContext = useContext(questionSetStore)
    const categoriesContext = useContext(categoriesStore)
    const [meeting, setMeeting] = useState(initMeeting)
    const [meetingCategories] = useState(initCategories)

    // const [questions, setQuestions] = useState(initialState)

    // const propsMeetingdata: any = (props.location as any).data;
    const [date, setDate] = useState(new Date())
    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())
    // const categoriesContext = useContext(categoriesStore)
    // const [discription, setDiscription] = useState(meeting?.discription ?? '')
    // const [topic, setTopic] = useState(context.meeting?.topic)
    // const [qSetId, setQSetId] = useState(context.meeting?.questionsSetId)

    useEffect(() => {
      if (meeting) {
        setDate(new Date(meeting?.startTime))
        setStartTime(new Date(meeting?.startTime))
        setEndTime(new Date(meeting?.endTime))
      }
    }, [meeting])

    // useEffect(() => {
    //   categoriesContext.fetchCategories(String(getCompanyId())).then(() => {
    //     setMeetingCategories(categoriesContext.categories)
    //   })
    // if (mid) {
    //   fetchMeetingByShortId(String(mid))
    //   feedbackcontext.fetchFeedback(String(mid))
    // }
    // }, [categoriesContext, feedbackcontext, mid])

    useEffect(() => {
      if (meeting?.questionsSetId)
        questionSetContext.fetchQuestionSet(meeting?.questionsSetId)
    }, [meeting, questionSetContext])

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
      const { qSet } = questionSetContext

      const theFeedback = qSet?.questions.map(item => {
        return {
          question: item.theQuestion,
          comments: getComments(item.questionId),
          voteAVG: getAvg(item.questionId)
        } as Feedback
      })
      return theFeedback || []
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getAvg, getComments, questionSetContext])

    const spliceDateAndTime = (datePart: Date, timePart: Date): Date => {
      datePart.setMinutes(timePart.getMinutes())
      datePart.setHours(timePart.getHours())
      return datePart
    }

    const updateMeetingClickHandler = () => {
      if (meeting) {
        meeting.endTime = spliceDateAndTime(date, endTime)
        meeting.startTime = spliceDateAndTime(date, startTime)
        update(meeting).then(res => {
          if (res === FetchStates.DONE) toast('Møde er slettet!')
          else toast('Der skete en fejl ved updatering af mødet.')
        })
      }
    }

    const deleteMeetingClickHandler = () => {
      if (meeting) {
        deleteMeeting(meeting)
        toast('Møde er slettet!')
        Router.push('/møder')
      }
    }

    // const getMeetingCategories = useCallback(() => {
    //   return
    // }, [categoriesContext, meeting.meetingCategories])

    return (
      <Page
        showBottomNav={false}
        title={meeting?.name ?? 'loading...'}
        showBackButton
      >
        <Section>
          <div className='btn-group'>
            <button
              type='button'
              className='button'
              onClick={updateMeetingClickHandler}
            >
              <Save
                style={{
                  height: '20px',
                  width: '20px',
                  marginRight: '7px',
                  marginTop: '2px'
                }}
              />
              Gem
            </button>
            <button
              type='button'
              className='button'
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
                  loading={categoriesContext.state === FetchStates.LOADING}
                  values={meeting?.meetingCategories.map(
                    item =>
                      ({
                        label:
                          meetingCategories?.filter(
                            i => i.categoryId === item.categoryId
                          )[0]?.name ?? 'Henter...',
                        value: item.categoryId
                      } as OptionsValue)
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
                feedbackLoading={feedbackcontext.state}
              />
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
  console.log('====================================')
  console.log(token)
  console.log('====================================')
  let data: MeetingModel | null = null
  let feedbackData: FeedbackBatch[] | null = null
  let CategoriesData: Category[] | null = null
  try {
    const response = await fetch(ApiRoutes.meetingByShortId(String(mid)), {
      headers: !token ? {} : { Authorization: `Bearer ${token}` }
    })
    data = await response.json()
    const feedbackResponse = await fetch(ApiRoutes.Feedbackbatch(String(mid)), {
      headers: !token ? {} : { Authorization: `Bearer ${token}` }
    })
    feedbackData = await feedbackResponse.json()
    console.log(feedbackData)

    const responseCategories = await fetch(
      ApiRoutes.Categories(String(getCompanyId(token))),
      {
        headers: !token ? {} : { Authorization: `Bearer ${token}` }
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

// Post.getInitialProps = async ctx => {
//   const { jwttoken } = cookies(ctx)
//   const { query } = ctx
//   const { mid } = query
//   let data: MeetingModel | null = null
//   let feedbackData: FeedbackBatch[] | null = null
//   try {
//     const response = await fetch(ApiRoutes.meetingByShortId(String(mid)), {
//       headers: !jwttoken ? {} : { Authorization: `Bearer ${jwttoken}` }
//     })
//     data = await response.json()

//     const feedbackResponse = await fetch(ApiRoutes.Feedbackbatch(String(mid)), {
//       headers: !jwttoken ? {} : { Authorization: `Bearer ${jwttoken}` }
//     })
//     data = await response.json()
//     feedbackData = await feedbackResponse.json()
//     console.log(feedbackData)
//   } catch (e) {
//     console.error(e)
//   }
//   return {
//     initMeeting: data,
//     intitFeedback: feedbackData
//   }
// }

export default Post

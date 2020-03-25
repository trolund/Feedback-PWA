/* eslint-disable jsx-a11y/label-has-associated-control */
import { useContext, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import { QRCode } from 'react-qr-svg'
import Page from '../../components/page'
import Section from '../../components/section'
import meetingStore from '../../stores/MeetingStore'
import feedbackStore from '../../stores/FeedbackStore'
import questionSetStore from '../../stores/QuestionSetStore'
import FeedbackView from '../../components/feedback'
import Feedback from '../../models/Feedback'
import ApiRoutes from '../../stores/api/ApiRoutes'
import states from '../../stores/requestState'

const Post = observer(() => {
  const router = useRouter()
  const { mid } = router.query
  // const qr = new QRCode()

  const {
    meeting,
    fetchMeetingByShortId,
    deleteMeeting,
    update,
    state
  } = useContext(meetingStore)
  const feedbackcontext = useContext(feedbackStore)
  const questionSetContext = useContext(questionSetStore)

  // const propsMeetingdata: any = (props.location as any).data;
  // const [title, setTitle] = useState(context.meeting?.name);
  // const [startDate, setStartDate] = useState(context.meeting?.startTime);
  // const [endDate, setEndDate] = useState(context.meeting?.endTime);
  // const [discription, setDiscription] = useState(context.meeting?.discription);
  // const [topic, setTopic] = useState(context.meeting?.topic);
  // const [qSetId, setQSetId] = useState(context.meeting?.questionsSetId);

  useEffect(() => {
    if (mid) {
      fetchMeetingByShortId(String(mid))
      feedbackcontext.fetchFeedback(String(mid))
    }
  }, [feedbackcontext, fetchMeetingByShortId, mid])

  useEffect(() => {
    if (meeting?.questionsSetId)
      questionSetContext.fetchQuestionSet(meeting?.questionsSetId)
  }, [meeting, questionSetContext])

  const count = useCallback(
    () =>
      feedbackcontext.feedbackBatch ? feedbackcontext.feedbackBatch?.length : 0,
    [feedbackcontext.feedbackBatch]
  )()

  // const getAvg = (questionId: string) =>
  //   feedbackcontext.feedbackBatch
  //     ? feedbackcontext.feedbackBatch.reduce((sumAvg, batchItem) => {
  //         return batchItem.feedback.reduce((avg, item, _, { length }) => {
  //           if (questionId === item.questionId) {
  //             return avg + item.answer / length
  //           }
  //           return avg
  //         }, 0)
  //       }, 0)
  //     : 0

  const getAvg = useCallback(
    (questionId: string) => {
      const returnAvg = feedbackcontext.feedbackBatch
        ?.map(i => i.feedback)
        .flat()
        .filter(x => x.questionId === questionId)
        .reduce((avg, item, _, { length }) => {
          return avg + item.answer / length
        }, 0)

      return returnAvg || 0
    },
    [feedbackcontext.feedbackBatch]
  )

  const getComments = useCallback(
    (questionId: string) => {
      return feedbackcontext.feedbackBatch
        ?.map(batch =>
          batch.feedback.map(feed =>
            feed.questionId === questionId ? feed.comment : null
          )
        )
        .flat()
        .filter(s => s !== null)
        .filter(s => s?.length! > 1)
    },
    [feedbackcontext.feedbackBatch]
  )

  const feedback = () => {
    const { qSet } = questionSetContext

    const theFeedback = qSet?.questions.map(item => {
      return {
        question: item.theQuestion,
        comments: getComments(item.questionId),
        voteAVG: getAvg(item.questionId)
      } as Feedback
    })
    return theFeedback || []
  }

  const updateMeetingClickHandler = () => {
    const model = meeting
    if (model) update(model)
  }

  const deleteMeetingClickHandler = () => {
    const model = meeting
    if (model) {
      deleteMeeting(model)
      //  props.history.push('/møder')
    }
  }

  return (
    <Page
      showBottomNav={false}
      title={meeting?.name ?? 'loading...'}
      showBackButton
    >
      {state === states.DONE && (
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
                  // onChange={e => (context.updateName = e.target.value)}
                />
                <label htmlFor='exampleText'>Beskrivelse</label>
                <textarea
                  name='text'
                  id='exampleText'
                  value={meeting?.discription}
                  // onChange={e => (context.updateDiscripton = e.target.value)}
                />
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor='exampleText'>Start tidspunkt</label>
                  <br />
                  {/* <DatePicker
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
              className='datetime'
              value={
                context.meeting ? context.meeting?.startTime.toString() : ''
              }
              onChange={e => {
                if (e) context.updateStartTime = e
              }}
            /> */}
                </div>
                <div>
                  <label htmlFor='exampleText'>Slut tidspunkt</label>
                  <br />
                  {/* <DatePicker
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
              className='datetime'
              value={context.meeting ? context.meeting?.endTime.toString() : ''}
              onChange={e => {
                if (e) context.updateEndTime = e
              }}
            /> */}
                </div>
              </form>
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
                  show eller hav denne side klar.
                </p>
              </div>
            </div>
          </div>
        </Section>
      )}

      {state === states.LOADING && <p>loading</p>}
      {state === states.FAILED && (
        <div className='center'>
          <b>404</b>
          <p>
            Mødet med id <b>{mid}</b> er ikke fundet.
          </p>
        </div>
      )}

      <style jsx>{`
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
    </Page>
  )
})

export default Post

/* eslint-disable jsx-a11y/label-has-associated-control */
import { useContext, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Page from '../../components/page'
import Section from '../../components/section'

import meetingStore from '../../stores/MeetingStore'
import feedbackStore from '../../stores/FeedbackStore'
import questionSetStore from '../../stores/QuestionSetStore'
import Feedback from '../../models/Feedback'

const Post = () => {
  const router = useRouter()
  const { mid } = router.query

  const context = useContext(meetingStore)
  const feedbackcontext = useContext(feedbackStore)
  const questionSetContext = useContext(questionSetStore)

  // const propsMeetingdata: any = (props.location as any).data;
  // const [title, setTitle] = useState(context.meeting?.name);
  // const [startDate, setStartDate] = useState(context.meeting?.startTime);
  // const [endDate, setEndDate] = useState(context.meeting?.endTime);
  // const [discription, setDiscription] = useState(context.meeting?.discription);
  // const [topic, setTopic] = useState(context.meeting?.topic);
  // const [qSetId, setQSetId] = useState(context.meeting?.questionsSetId);

  const qrURL = `/Api/Meeting/QrCode/${mid}`

  useEffect(() => {
    if (mid) {
      context.fetchMeetingByShortId(mid[0])
      feedbackcontext.fetchFeedback(mid[0])
    }
  }, [context, feedbackcontext, mid])

  useEffect(() => {
    if (context.meeting?.questionsSetId)
      questionSetContext.fetchQuestionSet(context.meeting?.questionsSetId)
  }, [context.meeting, questionSetContext])

  const count = useCallback(
    () =>
      feedbackcontext.feedbackBatch ? feedbackcontext.feedbackBatch?.length : 0,
    [feedbackcontext.feedbackBatch]
  )()

  // const getAvg = (questionId: string) =>
  //   feedbackcontext.feedbackBatch
  //     ? feedbackcontext.feedbackBatch.reduce((avg, item, _, { length }) => {
  //         return item.feedback.reduce((avg, item, _, { length }) => {
  //           if (questionId === item.questionId) {
  //             console.log(item.answer);

  //             return avg + item.answer / length;
  //           } else {
  //             return avg;
  //           }
  //         }, 0);
  //       }, 0)
  //     : 0;

  const getAvg = (questionId: string) => {
    const returnAvg = feedbackcontext.feedbackBatch
      ?.map(i => i.feedback)
      .flat()
      .filter(x => x.questionId === questionId)
      .reduce((avg, item, _, { length }) => {
        return avg + item.answer / length
      }, 0)

    return returnAvg || 0
  }

  const getComments = (questionId: string) => {
    return feedbackcontext.feedbackBatch
      ?.map(batch =>
        batch.feedback.map(feed =>
          feed.questionId === questionId ? feed.comment : null
        )
      )
      .flat()
      .filter(s => s !== null)
      .filter(s => s?.length! > 1)
  }

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

  const updateMeeting = () => {
    const model = context.meeting
    if (model) context.update(model)
  }

  const deleteMeeting = () => {
    const model = context.meeting
    if (model) {
      context.delete(model)
      //  props.history.push('/møder')
    }
  }

  return (
    <Page showBottomNav={false} showHead={false} showBackButton>
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
                value={context.meeting?.name}
                // onChange={e => (context.updateName = e.target.value)}
              />
              <label htmlFor='exampleText'>Beskrivelse</label>
              <textarea
                name='text'
                id='exampleText'
                value={context.meeting?.discription}
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
          </div>
          <div className='flex-item-right'>2</div>
        </div>
      </Section>

      <style jsx>{`
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
          background: tomato;
          padding: 5px;
          min-width: 250px;
          max-width: 320px;
          margin-top: 10px;
          color: white;
          text-align: center;
        }
        .flex-item-left {
          flex-grow: 1;
          background: green;
          padding: 5px;
          min-width: 50%;
          width: 600px;
          margin-top: 10px;
          color: white;
        }
      `}</style>
    </Page>
  )
}

export default Post

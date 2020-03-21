import { useState, useContext } from 'react'
import { ViewPager, Frame, Track } from 'react-view-pager'
import Page from '../components/page'
import feedbackStore from '../stores/FeedbackStore'
import Question from '../components/question'
import questions from '../stores/api/DummyData/questionTestData.json'

// import questionStore from '../stores/QuestionStore'

export default () => {
  const [page, setPage] = useState(0)
  // const { questions } = useContext(questionStore)
  const { feedback, createFeedbackBatch } = useContext(feedbackStore)

  const isFeedbackReady = () => {
    return feedback.every(item => item.answer >= 0)
  }

  const increment = () => {
    if (page < questions.questions.length - 1) {
      setPage(page + 1)
    }
  }
  const decrement = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  const next = () => {
    if (page === questions.questions.length - 1) {
      if (isFeedbackReady()) {
        console.debug('feedback send', feedback)
        const meetingId = 'GP'
        //createFeedbackBatch(feedback, meetingId)
      } else {
        console.debug('Feedback er ikke klar!')
      }
    } else {
      increment()
    }

    console.debug(feedback)
  }

  const prev = () => {
    decrement()
  }

  return (
    <Page showBottomNav={false} showHead={false}>
      <ViewPager tag='main'>
        <Frame className='frame'>
          <Track
            // ref={(c: number) => setPage(c)}
            // viewsToShow={1}
            currentView={page}
            // onViewChange={(pageNumber: number) => setPage(pageNumber)}
            className='track'
          >
            {questions !== null &&
              questions.questions.map(item => (
                <Question
                  key={item.questionId}
                  question={item.theQuestion}
                  questionId={item.questionId}
                />
              ))}
          </Track>
        </Frame>
        <nav className='pager-controls'>
          <a
            className='pager-control pager-control--prev button float-left'
            tabIndex={0}
            role='button'
            onKeyDown={() => prev()}
            onClick={() => prev()}
          >
            Prev
          </a>
          <a
            className='pager-control pager-control--next button float-right'
            tabIndex={0}
            role='button'
            onKeyDown={() => next()}
            onClick={() => next()}
          >
            Next
          </a>
        </nav>
      </ViewPager>
      <style jsx>{`
        .pager-controls {
          padding: 30px;
        }
        .pager-control {
          text-align: center;
          width: 120px;
        }
        .main {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </Page>
  )
}

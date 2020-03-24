import { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import Router from 'next/router'
import Modal from 'react-modal'
import { ViewPager, Frame, Track } from 'react-view-pager'
import Page from '../components/page'
import feedbackStore from '../stores/FeedbackStore'
import Question from '../components/question'
import questionStore from '../stores/QuestionStore'
import FeedbackDoneOverlay from '../components/FeedbackDoneOverlay'
import states from '../stores/requestState'

// import questionStore from '../stores/QuestionStore'

export default observer(() => {
  const [page, setPage] = useState(0)
  const [showOverlay, setShowOverlay] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { questions, meetingId } = useContext(questionStore)
  const { feedback, createFeedbackBatch, state } = useContext(feedbackStore)

  useEffect(() => {
    if (!questions) Router.push('/')
  })

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
        console.log('feedback send', feedback)
        createFeedbackBatch(feedback, meetingId).then(() => {
          if (state === states.DONE) {
            setShowOverlay(true)
          }
        })
      } else {
        setModalOpen(true)
        console.log('Feedback er ikke klar!')
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
    <>
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
      {showOverlay && <FeedbackDoneOverlay />}

      <Modal
        isOpen={modalOpen}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={closeModal}
        // style={modalStyles}
        contentLabel='Example Modal'
        className='modal'
      >
        <h2>Besvarelse ikke klar!</h2>
        <button type='button' tabIndex={0} onClick={() => setModalOpen(false)}>
          close
        </button>
        <div>
          Du skal besvare alle spørgsmål før du kan sende din besvarelse.
        </div>
        <form>
          <input />
          <button type='button' tabIndex={0}>
            tab navigation
          </button>
          <button type='button' tabIndex={0}>
            stays
          </button>
          <button type='button' tabIndex={0}>
            inside
          </button>
          <button type='button' tabIndex={0}>
            the modal
          </button>
        </form>
        <style jsx>{`
           {
            /* .ReactModal__Overlay {
            background-color: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(0.2);
          } */
          }
        `}</style>
      </Modal>
    </>
  )
})

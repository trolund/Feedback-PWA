import { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import Router from 'next/router'
import Modal from 'react-modal'
import { ViewPager, Frame, Track } from 'react-view-pager'
import { X } from 'react-feather'
import Page from '../components/page'
import feedbackStore from '../stores/FeedbackStore'
import Question from '../components/question'
import questionStore from '../stores/QuestionStore'
import FeedbackOverlay from '../components/FeedbackDoneOverlay'
import states from '../stores/requestState'

// import questionStore from '../stores/QuestionStore'

export default observer(() => {
  const [page, setPage] = useState(0)
  const [showOverlay, setShowOverlay] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { questions, meetingId } = useContext(questionStore)
  const { feedback, createFeedbackBatch } = useContext(feedbackStore)

  const [success, setSuccess] = useState(false)
  const [overlayText, setOverlayText] = useState('')

  useEffect(() => {
    if (!questions) Router.back()
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
        createFeedbackBatch(feedback, meetingId).then(res => {
          if (res === states.DONE) {
            setSuccess(true)
            setOverlayText('Tak for din besvarelse')
            setShowOverlay(true)
          } else {
            setSuccess(false)
            setOverlayText('Der skete desværre en fejl')
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
      {showOverlay && <FeedbackOverlay success={success} text={overlayText} />}

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
          <X /> close
        </button>
        <div>
          Du skal besvare alle spørgsmål før du kan sende din besvarelse.
        </div>
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

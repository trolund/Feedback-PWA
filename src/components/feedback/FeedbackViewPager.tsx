import { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react'
import { ViewPager, Frame, Track } from 'react-view-pager'
import { X, Send } from 'react-feather'
import Modal from 'react-modal'
import rootStore from '../../stores/RootStore'
import IQuestionSet from '../../models/QuestionSet'
import FetchStates from '../../stores/requestState'
import Question from './question'
import FeedbackOverlay from './FeedbackDoneOverlay'
import { logEvent } from '../../utils/analytics'

type FeedbackViewPagerProps = {
  initQuestions: IQuestionSet
  mid: string
  fingerprint: string
}

const FeedbackViewPager = observer(
  ({ initQuestions, mid, fingerprint }: FeedbackViewPagerProps) => {
    const [page, setPage] = useState(0)
    const [showOverlay, setShowOverlay] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const {
      feedbackStore: { feedback, createFeedbackBatch }
    } = useContext(rootStore)

    const [questions] = useState(initQuestions)
    const [success, setSuccess] = useState(false)
    const [overlayText, setOverlayText] = useState('')

    const isFeedbackReady = () => {
      return feedback.every(item => item.answer >= 0)
    }

    const increment = () => {
      if (
        questions !== null &&
        page < questions?.questions.length - 1 &&
        feedback[page].answer > -1
      ) {
        setPage(page + 1)
      }
    }
    const decrement = () => {
      if (page > 0) {
        setPage(page - 1)
      }
    }

    const next = (e: any) => {
      e.preventDefault()
      if (
        questions !== null &&
        page === questions?.questions.length - 1 &&
        feedback[page]?.answer !== -1
      ) {
        if (isFeedbackReady()) {
          createFeedbackBatch(
            feedback,
            String(mid),
            fingerprint,
            questions.questionSetId
          ).then(res => {
            if (res === FetchStates.DONE) {
              setSuccess(true)
              setOverlayText('Tak for din besvarelse')
              setShowOverlay(true)
              logEvent('Feedback', 'feedback send - succes')
            } else {
              setSuccess(false)
              setOverlayText('Der skete desværre en fejl')
              setShowOverlay(true)
              logEvent('Feedback', 'feedback send - error')
            }
          })
        } else {
          setModalOpen(true)
          console.log('Feedback er ikke klar!')
          logEvent('Feedback', 'feedback send - not ready')
        }
      } else {
        increment()
      }
    }

    const prev = () => {
      decrement()
    }

    return (
      <>
        <div
          className='indicator'
          style={{
            width: '100vw',
            height: 'calc(var(--safe-area-inset-top) + 5px)',
            position: 'fixed',
            top: '0px',
            left: '0px',
            backgroundColor: 'var(--surface)'
          }}
        >
          <div
            style={{
              transition: 'width 200ms',
              backgroundColor: 'var(--accent)',
              width: `calc(100vw / ${questions?.questions.length} * ${page +
                1}`,
              height: '100%'
            }}
          ></div>
        </div>
        <div
          style={{
            width: 'fit-content',
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 'calc(var(--safe-area-inset-top) + 20px)',
            color: 'var(--text)',
            fontWeight: 'bold'
          }}
        >{`${page + 1}/${questions?.questions.length}`}</div>
        <ViewPager tag='main'>
          <Frame className='frame' autoSize>
            <Track
              // ref={(c: number) => setPage(c)}
              // viewsToShow={1}
              swipe={false}
              currentView={page}
              // onViewChange={onViewChange}
              className='track'
            >
              {questions !== null &&
                questions?.questions?.map(item => (
                  <Question
                    // setNextenable={setEnableNext}
                    key={item.questionId}
                    question={item.theQuestion}
                    questionId={item.questionId}
                  />
                ))}
            </Track>
          </Frame>
          <nav className='pager-controls'>
            <div className='controller-container'>
              {page !== 0 && (
                <button
                  type='button'
                  className='pager-control pager-control--prev button float-left'
                  onClick={() => prev()}
                  data-cy={`prev`}
                >
                  Tilbage
                </button>
              )}
              <button
                type='button'
                className='pager-control pager-control--next button float-right'
                onClick={e => next(e)}
                data-cy={`next`}
                disabled={feedback[page]?.answer === -1}
              >
                {page === questions?.questions?.length - 1 ? (
                  <>
                    <Send
                      style={{ marginBottom: '-7px', marginRight: '10px' }}
                    />
                    Send besvarelse
                  </>
                ) : (
                  'Næste'
                )}
              </button>
            </div>
          </nav>
        </ViewPager>
        {showOverlay && (
          <FeedbackOverlay success={success} text={overlayText} />
        )}
        <Modal
          isOpen={modalOpen}
          // onAfterOpen={afterOpenModal}
          // onRequestClose={closeModal}
          // style={modalStyles}
          contentLabel='Example Modal'
          className='modal'
        >
          <h2>Besvarelse ikke klar!</h2>
          <button
            type='button'
            tabIndex={0}
            onClick={() => setModalOpen(false)}
          >
            <X /> close
          </button>
          <div>
            Du skal besvare alle spørgsmål før du kan sende din besvarelse.
          </div>
        </Modal>
        <style jsx>{`
          @media only screen and (orientation: landscape) {
            .view {
              width: auto;
              margin-left: auto;
              margin-right: auto;
            }

            .frame {
              margin-top: var(--safe-area-inset-top) + 15px;
            }
          }
        `}</style>
        <style jsx global>{`
          @media only screen and (orientation: landscape) {
            .view {
              width: auto;
              margin-left: auto;
              margin-right: auto;
            }

            .frame {
              margin-top: var(--safe-area-inset-top) + 15px;
            }
          }

          .view {
            width: 100vw !important;
            padding: 5px;
          }
        `}</style>
      </>
    )
  }
)

export default FeedbackViewPager

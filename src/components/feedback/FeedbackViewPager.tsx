import { useState, useContext } from 'react'
import { observer } from 'mobx-react'
import { ViewPager, Frame, Track } from 'react-view-pager'
import { X } from 'react-feather'
import Modal from 'react-modal'
import rootStore from '../../stores/RootStore'
import QuestionSet from '../../models/QuestionSet'
import FetchStates from '../../stores/requestState'
import Question from './question'
import FeedbackOverlay from './FeedbackDoneOverlay'

type FeedbackViewPagerProps = {
  initQuestions: QuestionSet
  mid: string
  fingerprint: string
}

const FeedbackViewPager = observer(
  ({ initQuestions, mid, fingerprint }: FeedbackViewPagerProps) => {
    // const router = useRouter()
    // const { mid } = router.query
    const [page, setPage] = useState(0)
    const [showOverlay, setShowOverlay] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const {
      feedbackStore: { feedback, createFeedbackBatch }
    } = useContext(rootStore)

    const [questions] = useState(initQuestions)

    const [success, setSuccess] = useState(false)
    const [overlayText, setOverlayText] = useState('')

    // useEffect(() => {
    //   if (questions?.questions?.length === 0 || !questions) Router.back()
    // })

    // useEffect(() => {
    //   if (feedback[page].answer !== -1) {
    //     setEnableNext(false)
    //   }
    // }, [feedback, page])

    // const onViewChange = (pageNumber: number) => {
    //   if (feedback[page].answer === -1) {
    //     setEnableNext(true)
    //   } else {
    //     setEnableNext(false)
    //   }
    //   setPage(pageNumber)
    // }

    const isFeedbackReady = () => {
      return feedback.every(item => item.answer >= 0)
    }

    const increment = () => {
      console.log(
        questions !== null,
        page < questions?.questions.length - 1,
        feedback[page].answer > -1
      )

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
          createFeedbackBatch(feedback, String(mid), fingerprint).then(res => {
            if (res === FetchStates.DONE) {
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
                >
                  tilbage
                </button>
              )}
              <button
                type='button'
                className='pager-control pager-control--next button float-right'
                onClick={e => next(e)}
                disabled={feedback[page]?.answer === -1}
              >
                {page === questions?.questions?.length - 1
                  ? 'Send besvarelse'
                  : 'Næste'}
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
      </>
    )
  }
)

export default FeedbackViewPager

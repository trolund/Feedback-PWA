import { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import Router, { useRouter } from 'next/router'
import Modal from 'react-modal'
import { ViewPager, Frame, Track } from 'react-view-pager'
import { NextPage } from 'next'
import https from 'https'
import { X } from 'react-feather'
import fetch from 'isomorphic-unfetch'
import FetchStates from '../../stores/requestState'
import Question from '../../components/question'
import Page from '../../components/page'
import FeedbackOverlay from '../../components/FeedbackDoneOverlay'
import ApiRoutes from '../../stores/api/ApiRoutes'
import QuestionSet from '../../models/QuestionSet'
import feedbackStore from '../../stores/FeedbackStore'

type FeedbackInitProps = {
  initQuestions: QuestionSet
}

const Feedback: NextPage = observer(({ initQuestions }: FeedbackInitProps) => {
  const router = useRouter()
  const { mid } = router.query
  const [page, setPage] = useState(0)
  const [showOverlay, setShowOverlay] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  // const { meetingId } = useContext(questionStore)
  const { feedback, createFeedbackBatch } = useContext(feedbackStore)

  const [questions] = useState(initQuestions)

  const [success, setSuccess] = useState(false)
  const [overlayText, setOverlayText] = useState('')

  useEffect(() => {
    if (questions?.questions?.length === 0 || !questions) Router.back()
  })

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
        createFeedbackBatch(feedback, String(mid)).then(res => {
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
      <Page showBottomNav={false} showHead={false}>
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
                questions?.questions.map(item => (
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
                {page === questions.questions.length - 1
                  ? 'Send besvarelse'
                  : 'Næste'}
              </button>
            </div>
          </nav>
        </ViewPager>
        <style jsx global>{`
          .frame {
            height: 80vh !important;
            padding-bottom: 10px;
          }
        `}</style>
        <style jsx>{`
          .controller-container {
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
          }

          .pager-controls {
            padding: 30px;
            position: fixed;
            bottom: 0px;
            left: 0px;
            right: 0px;
            width: 100%;
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

Feedback.getInitialProps = async ctx => {
  const { query } = ctx
  const { mid } = query
  const url = ApiRoutes.FetchQuestions(String(mid))
  let data: QuestionSet[] | null = null
  const options = {
    agent: new https.Agent({
      // TODO fix for production with real SSL CERT
      rejectUnauthorized: false
    })
  }
  try {
    const response = await fetch(url, { headers: {}, ...options })
    data = await response.json()
  } catch (e) {
    console.error(e)
  }
  return {
    initQuestions: data
  }
}

export default Feedback

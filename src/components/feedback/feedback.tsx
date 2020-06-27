import { useState, useCallback, useEffect, useContext } from 'react'
import { observer } from 'mobx-react'
import { Bar } from 'react-chartjs-2'
import Collapsible from 'react-collapsible'
import Modal from 'react-modal'
import {
  CircularProgressbar,
  buildStyles,
  CircularProgressbarWithChildren
} from 'react-circular-progressbar'
import { MessageCircle, Monitor, X, Check } from 'react-feather'
import Feedback from '../../models/Feedback'
import FetchStates from '../../stores/requestState'
import FeedbackProcessbar from './feedback-progressbar'
import CustomSwitch from '../Input/custom-switch'
import { chartColors } from '../../services/colorContants'
import { sortFeedbackByQuestionsIndex } from '../../services/sortService'
import rootStore from '../../stores/RootStore'
import Comment from '../../models/Comment'
import Switch from 'react-switch'

interface IProp {
  feedbackLoading: FetchStates
  isRealtime: boolean
  // setIsRealtime: (value: boolean) => void
}

const FeedbackView = observer(({ isRealtime }: IProp) => {
  const [activeTab, setActiveTab] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [wWidth, setWWidth] = useState(0)
  const [, setWHeight] = useState(0)

  const {
    questionSetStore: { qSet },
    feedbackStore: { feedbackBatch },
    settingStore: { realtimeFeedbackDefault, setRealtimeFeedbackDefault }
  } = useContext(rootStore)

  const updateWindowSize = () => {
    setWWidth(window.innerWidth)
    setWHeight(window.innerHeight)
  }

  useEffect(() => {
    setWWidth(window.innerWidth)
    setWHeight(window.innerHeight)
    window.addEventListener('resize', updateWindowSize)
    return window.removeEventListener('resize', updateWindowSize)
  }, [])

  const getAvg = useCallback(
    (questionId: string) => {
      const returnAvg = feedbackBatch
        .map(i => i.feedback)
        .flat()
        .filter(x => x.questionId === questionId)
        .reduce((avg, item, _, { length }) => {
          return avg + item.answer / length
        }, 0)
      return returnAvg
    },
    [feedbackBatch]
  )

  const getComments = useCallback(
    (questionId: string) => {
      return feedbackBatch
        ?.map(batch =>
          batch.feedback.map(feed =>
            feed.questionId === questionId
              ? ({ comment: feed.comment, vote: feed.answer } as Comment)
              : null
          )
        )
        .flat()
        .filter(s => s !== null)
        .filter(s => s?.comment.length! > 0)
    },
    [feedbackBatch]
  )

  const feedback = useCallback(() => {
    const theFeedback = qSet?.questions.map(item => {
      return {
        questionIndex: item.index,
        questionId: item.questionId,
        question: item.theQuestion,
        comments: getComments(item.questionId),
        voteAVG: getAvg(item.questionId)
      } as Feedback
    })
    return theFeedback || []
  }, [qSet, feedbackBatch])

  const avgRes = useCallback(() => {
    return feedback()
      ? feedback().reduce((avg, item, _, { length }) => {
          return avg + item.voteAVG / length
        }, 0)
      : 0
  }, [feedback])

  const count = useCallback(() => (feedbackBatch ? feedbackBatch?.length : 0), [
    feedbackBatch
  ])

  const commentTitelBar = (title: string, count: number) => {
    return (
      <div className='d-flex flex-row bd-highlight'>
        <p
          className='flex-grow-1'
          style={{ marginBottom: '0px', marginLeft: '50px' }}
        >
          {title}
        </p>
        <p style={{ marginBottom: '0px', marginTop: '-25px' }}>{count}</p>
      </div>
    )
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      width: '100%',
      height: '100%',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  }

  const getLabels = useCallback((): string[] => {
    if (wWidth < 550) {
      return feedback().map((i, n) => String(n + 1))
    }
    return feedback().map(i => i.question)
  }, [feedback, wWidth])

  const graphData = useCallback(
    (canvas: any) => {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      const gradient = ctx.createLinearGradient(0, 0, 0, 400)
      gradient.addColorStop(0, chartColors.start)
      gradient.addColorStop(1, chartColors.end)

      return {
        labels: getLabels(),
        datasets: [
          {
            label: 'Feedback',
            backgroundColor: gradient, // Put the gradient here as a fill color
            borderColor: chartColors.border,
            borderWidth: 2,
            pointColor: '#fff',
            pointStrokeColor: chartColors.border,
            pointHighlightFill: '#fff',
            pointHighlightStroke: chartColors.hightlight,
            data: feedback().map(i => i.voteAVG)
          }
        ]
      }
    },
    [getLabels, feedback]
  )

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false
    }
  }

  return (
    <div>
      <div className='feedback-header'>
        <h2 className='float-left'>Tilbagemeldinger</h2>
        <div className='feedback-header-info'>
          {/* Vis tilbagemeldinger løbende */}
          <Monitor
            style={{ margin: '0px', marginRight: '10px' }}
            onClick={() => setShowModal(true)}
          />
          <Switch
            onChange={setRealtimeFeedbackDefault}
            checked={isRealtime}
            onColor='#0594A6'
            offColor='#6a6b6e'
            uncheckedIcon={
              <X
                style={{
                  width: '27px',
                  height: '27px',
                  padding: '5px',
                  color: 'white'
                }}
              />
            }
            checkedIcon={
              <Check
                style={{
                  width: '27px',
                  height: '27px',
                  padding: '5px',
                  color: 'white'
                }}
              />
            }
          />
          <div className='counter-container'>
            <p>Antal besvarelser</p>
            <h2 className='align-middle counter'>{count()}</h2>
          </div>
        </div>
      </div>
      <div>
        <nav>
          <span
            className={activeTab !== 1 ? 'tab-btn-selected tab-btn' : 'tab-btn'}
            role='button'
            tabIndex={0}
            onKeyDown={() => {}}
            onClick={() => {
              setActiveTab(1)
            }}
          >
            Tilbagemeldinger
          </span>
          <span
            className={activeTab !== 2 ? 'tab-btn-selected tab-btn' : 'tab-btn'}
            role='button'
            tabIndex={0}
            onKeyDown={() => {}}
            onClick={() => {
              setActiveTab(2)
            }}
          >
            Kommentarer
          </span>
        </nav>
        {activeTab === 1 && (
          <div className='tab-content'>
            <div className='questions'>
              {count() > 0 ? (
                feedback()
                  ?.sort(sortFeedbackByQuestionsIndex)
                  .map((item, index) => (
                    <FeedbackProcessbar
                      key={index}
                      question={item.question}
                      voteAVG={item.voteAVG}
                      questionNumber={index + 1}
                    />
                  ))
              ) : (
                <p>Ingen tilbagemeldinger</p>
              )}
            </div>
          </div>
        )}
        {activeTab === 2 && (
          <div className='tab-content'>
            <div className='questions'>
              {feedback().reduce((a, b) => a + b.comments.length, 0) > 0 ? (
                feedback()
                  ?.sort(sortFeedbackByQuestionsIndex)
                  .map((item: Feedback, index) => {
                    if (item.comments?.length > 0) {
                      return (
                        <Collapsible
                          key={index}
                          trigger={commentTitelBar(
                            item.question,
                            item.comments.length
                          )}
                        >
                          <div className='collapsible-content'>
                            {item.comments.map((comment: Comment, index) => (
                              <div key={index} className='comment'>
                                <MessageCircle className='float-left' />
                                <li style={{ listStyle: 'none' }}>
                                  <p
                                    style={{
                                      marginLeft: '40px',
                                      marginBottom: '0px'
                                    }}
                                  >
                                    {comment.vote} - {comment.comment}
                                  </p>
                                </li>
                              </div>
                            ))}
                          </div>
                        </Collapsible>
                      )
                    }
                    return null
                  })
              ) : feedback().reduce((a, b) => a + b.comments.length, 0) > 0 ? (
                <p>Ingen tilbagemeldinger</p>
              ) : (
                <p>Der er ingen kommentare tilkyttet tilbagemeldingerne</p>
              )}
            </div>
          </div>
        )}
        <div className='end-result'>
          <h2 style={{ width: 'max-content' }}>Samlet resultat</h2>
          <CircularProgressbarWithChildren
            value={avgRes()}
            styles={buildStyles({
              textColor: 'var(--accent)',
              pathColor: 'var(--accent)',
              trailColor: 'var(--surface)',
              strokeLinecap: 'round',
              textSize: '1rem',
              pathTransitionDuration: 0.5
            })}
            maxValue={3}
            minValue={0}
          >
            <div
              style={{
                fontSize: 40,
                marginTop: -5,
                color: 'var(--accent)'
              }}
            >
              <strong>{avgRes().toFixed(2)}</strong>
            </div>
          </CircularProgressbarWithChildren>
        </div>
      </div>
      {showModal && (
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          style={customStyles}
          contentLabel='Example Modal'
          className='modal'
          overlayClassName='Overlay'
          ariaHideApp={false} // TODO fjern dette og fix fejl
        >
          <div className='top-bar'>
            <X
              type='button'
              className='close-modal'
              onClick={() => setShowModal(false)}
            />
            <h3>Tilbagemeldinger</h3>
          </div>
          <div className='chart-container'>
            <Bar data={graphData} options={chartOptions} />
          </div>
        </Modal>
      )}
      <style jsx>{`
        @media only screen and (max-width: 440px) {
          .counter-container {
            float: center;
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
          }
          .end-result {
            margin-left: auto;
            margin-right: auto;
          }

          .feedback-header-info {
            float: none;
            width: 100%;
          }
        }

        .feedback-header-info {
          float: right;
        }

        .chart-container {
          width: 100%;
          height: 100%;
          padding-top: calc(var(--safe-area-inset-top) + 60px);
          padding-bottom: calc(var(--safe-area-inset-bottom) + 20px);
          padding-right: calc(var(--safe-area-inset-right) + 20px);
          padding-left: calc(var(--safe-area-inset-left) + 20px);
        }

        .tab-content {
          padding-top: 25px;
        }

        .tab-btn {
          border: solid var(--label) 1px;
          border-top-right-radius: var(--border-radius);
          border-top-left-radius: var(--border-radius);
          border-bottom: none;
          padding: 15px;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Chrome/Safari/Opera */
          -khtml-user-select: none; /* Konqueror */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version */
        }

        .top-bar {
          position: absolute;
          width: 100%;
          top: calc(var(--safe-area-inset-top) + (72px / 3));
          padding-right: calc(var(--safe-area-inset-right) + 20px);
          padding-left: calc(var(--safe-area-inset-left) + 20px);
        }

        .top-bar > h3 {
          margin-bottom: 20px;
        }

        .tab-btn-selected {
          background: linear-gradient(
            0deg,
            rgba(255, 255, 255, 1) 0%,
            rgba(12, 62, 51, 0.4108018207282913) 99%
          );
          opacity: 0.5;
        }
        .questions {
          padding-top: 20px;
        }

        .feedback-header {
          overflow: auto;
        }

        .counter {
          font-weight: bold;
          text-align: center;
          border-bottom: var(--accent) solid 5px;
        }

        .end-result {
          padding-top: 25px;
          padding-bottom: 25px;
          max-width: 230px;
          margin-left: auto;
          margin-right: auto;
        }

        .end-result h2 {
          padding-top: 25px;
          padding-bottom: 25px;
          text-align: center;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
      <style jsx global>{`
        .Collapsible {
          background-color: var(--accent);
          border-radius: var(--border-radius);
        }

        .collapsible-content {
          padding: 15px;
        }

        .Collapsible__trigger.is-open::before {
          margin: 5px;
          width: 12px;
          height: 12px;
          transform: rotate(45deg);
          border-right: whitesmoke 2px solid;
          border-bottom: whitesmoke 2px solid;
          content: ' ';
          position: relative;
          float: right;
          transition: ease-in-out 0.3s;
        }

        .Collapsible__trigger.is-closed::before {
          margin: 5px;
          width: 12px;
          height: 12px;
          transform: rotate(-45deg);
          border-right: whitesmoke 2px solid;
          border-bottom: whitesmoke 2px solid;
          content: ' ';
          position: relative;
          float: right;
          transition: ease-in-out 0.3s;
        }

        .Collapsible__trigger {
          min-width: 100% !important;
          padding: var(--gap-small);
          padding-left: 20px;
          background-color: var(--accent);
          display: block;
          border-radius: var(--border-radius);
          margin-top: var(--gap-small);
          color: whitesmoke;
        }

        .Collapsible__contentOuter {
          margin: 0px !important;
          width: 100%;
        }

        .comment {
          background-color: var(--surface);
          border-radius: var(--border-radius);
          padding: 7px;
          margin-top: 5px;
        }

        .comment:first-child {
          margin-top: 0px;
        }
      `}</style>
    </div>
  )
})

export default FeedbackView

import { useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import Collapsible from 'react-collapsible'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import { MessageCircle } from 'react-feather'
import Feedback from '../models/Feedback'
import states from '../stores/requestState'
import FeedbackProcessbar from './feedback-progressbar'

interface IProp {
  feedback: Feedback[] | undefined
  count: number
  feedbackLoading: states
}

const FeedbackView = observer((props: IProp) => {
  const [activeTab, setActiveTab] = useState(1)

  const avgRes = useCallback(() => {
    return props.feedback
      ? props.feedback.reduce((avg, item, _, { length }) => {
          return avg + item.voteAVG / length
        }, 0)
      : 0
  }, [props.feedback])

  const sortQuestions = (a: Feedback, b: Feedback) => {
    if (a.question < b.question) {
      return -1
    }
    if (a.question > b.question) {
      return 1
    }
    return 0
  }

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

  return (
    <div>
      <div className='feedback-header'>
        <h2 className='float-left'>Tilbagemeldinger</h2>
        <div className='float-right counter-container'>
          Antal besvarelser
          <h2 className='align-middle counter'>{props.count}</h2>
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
            Feedback
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
            Kommentare
          </span>
        </nav>
        {activeTab === 1 && (
          <div className='tab-content'>
            <div className='questions'>
              {(props.feedback?.length ?? 0) > 0 ? (
                props.feedback
                  ?.sort(sortQuestions)
                  .map((item, index) => (
                    <FeedbackProcessbar
                      key={index}
                      question={item.question}
                      voteAVG={item.voteAVG}
                      questionNumber={index + 1}
                    />
                  ))
              ) : (
                <p>loading...</p>
              )}
            </div>
          </div>
        )}
        {activeTab === 2 && (
          <div className='tab-content'>
            {props.feedback
              ?.sort(sortQuestions)
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
                        {item.comments.map((comment: string) => (
                          <div key={comment} className='comment'>
                            <MessageCircle className='float-left' />
                            <li style={{ listStyle: 'none' }}>
                              <p
                                style={{
                                  marginLeft: '40px',
                                  marginBottom: '0px'
                                }}
                              >
                                {comment}
                              </p>
                            </li>
                          </div>
                        ))}
                      </div>
                    </Collapsible>
                  )
                }
                return null
              })}
          </div>
        )}
        {props.feedback.reduce((a, b) => a + b.comments?.length ?? 0, 0) ===
          0 && <p>Ingen Kommentare</p>}
        <div className='end-result'>
          <h2>Overodtnet resultat</h2>
          <CircularProgressbar
            styles={buildStyles({
              textColor: 'var(--accent)',
              pathColor: 'var(--accent)',
              trailColor: 'var(--surface)',
              strokeLinecap: 'round'
            })}
            value={avgRes()}
            text={`${avgRes().toFixed(2)}`}
            maxValue={4}
            minValue={0}
          />
        </div>
      </div>

      <style jsx>{`
        @media only screen and (max-width: 440px) {
          .counter-container {
            float: center;
            width: 100%;
            padding: 10px;
            margin: 10px;
          }
          .end-result {
            margin-left: auto;
            margin-right: auto;
          }
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
          border-bottom: #19896f solid 5px;
        }

        .end-result {
          padding-top: 25px;
          padding-bottom: 25px;
          max-width: 250px;
          max-height: 250px;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
      <style jsx global>{`
        .Collapsible {
          background-color: #19896f;
          border-radius: var(--border-radius);
           {
            /* border-bottom: #19896f solid 2px;
          border-left: #19896f solid 2px;
          border-right: #19896f solid 2px; */
          }
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
          padding: 10px;
          padding-left: 20px;
          background-color: #19896f;
          display: block;
          border-radius: var(--border-radius);
          margin-top: 5px;
          color: whitesmoke;
        }
         {
          /* 
        .Collapsible__trigger::after {
          content: attr(data-count);
          width: 20px;
          height: 20px;
          float: right;
          margin-right: 20px;

          display: block;

          color: whitesmoke;
        } */
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

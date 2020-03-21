// import { useContext, useState, useEffect } from 'react'
import { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { View } from 'react-view-pager'
import feedbackStore from '../stores/FeedbackStore'
import FeedbackModel from '../models/FeedbackModel'

interface IProp {
  question: string
  questionId: string
}
const Question: React.FC<IProp> = observer(({ question, questionId }) => {
  const { setFeedbackItem } = useContext(feedbackStore)
  const [answer, setAnswer] = useState(-1)
  const [comment, setComment] = useState('')

  useEffect(() => {
    const feedbackItem: FeedbackModel = {
      answer,
      comment,
      questionId
    }
    setFeedbackItem(feedbackItem)
  }, [answer, comment, questionId, setFeedbackItem])

  return (
    <View className='view'>
      <div className='question'>
        <h2>
          {question} - {answer}
        </h2>
      </div>
      <div className='flex-container'>
        <div
          className={answer === 0 ? 'one smiley' : 'one smiley selected'}
          role='button'
          data-answer={0}
          tabIndex={0}
          aria-label='zero'
          onKeyDown={e =>
            setAnswer(e.currentTarget.attributes['data-answer'].value)
          }
          onClick={e =>
            setAnswer(e.currentTarget.attributes['data-answer'].value)
          }
        />
        <div
          className={answer === 1 ? 'two smiley' : 'two smiley selected'}
          role='button'
          data-answer={1}
          tabIndex={0}
          aria-label='one'
          onKeyDown={e =>
            setAnswer(e.currentTarget.attributes['data-answer'].value)
          }
          onClick={e =>
            setAnswer(e.currentTarget.attributes['data-answer'].value)
          }
        />
        <div
          className={answer === 2 ? 'three smiley' : 'three smiley selected'}
          role='button'
          data-answer={2}
          tabIndex={0}
          aria-label='two'
          onKeyDown={e =>
            setAnswer(e.currentTarget.attributes['data-answer'].value)
          }
          onClick={e =>
            setAnswer(e.currentTarget.attributes['data-answer'].value)
          }
        />
        <div
          className={answer === 3 ? 'four smiley' : 'four smiley'}
          role='button'
          data-answer={3}
          tabIndex={0}
          aria-label='three'
          onKeyDown={e =>
            setAnswer(e.currentTarget.attributes['data-answer'].value)
          }
          onClick={e =>
            setAnswer(e.currentTarget.attributes['data-answer'].value)
          }
        />
      </div>
      <textarea
        className='comment'
        value={comment}
        placeholder='Kommentar'
        onChange={val => setComment(val.target.value)}
      />
      <style jsx>{`
        .question {
          width: 100%;
          text-align: center;
          height: 40%;
          padding-bottom: 50px;
        }
        .view {
          width: 100%;
          height: 100%;
        }
        .flex-container {
          display: flex;
          flex-wrap: nowrap;
          justify-content: center;
          padding-top: 25px;
          padding-bottom: 25px;
        }

        .flex-container > div {
          background-color: #f1f1f1;
          width: 100px;
          margin: 10px;
          text-align: center;
          line-height: 75px;
          font-size: 30px;
        }
        .one {
          background-image: url('/images/meget_sur.png');
        }
        .two {
          background-image: url('/images/sur.png');
        }
        .three {
          background-image: url('/images/tilfreds.png');
        }
        .four {
          background-image: url('/images/meget_glad.png');
        }
        .smiley {
          background-size: contain;
          width: 75px !important;
          height: 75px !important;
          border-radius: 50%;
          transition: filter 0.5s;
          cursor: pointer;
        }
        .smiley:hover {
          filter: contrast(2);
        }
        .comment {
          display: block;
          text-align: center;
          height: 100px;
          margin-left: auto;
          margin-right: auto;
          width: 90%;
          color: var(--fg);
          background: var(--surface);
          display: flex;
          align-items: center;
          transition: var(--transition-colors);
          border-color: var(--fg);
          border: 1px solid;
          border-radius: 15px;
          margin-top: 30px;
        }
        .smiley {
          box-sizing: border-box;
          border: 5px solid var(--label);
        }
      `}</style>
    </View>
  )
})

export default Question

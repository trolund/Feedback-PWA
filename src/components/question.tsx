// import { useContext, useState, useEffect } from 'react'
import { useState } from 'react'
import { View } from 'react-view-pager'
import VoteScale from '../models/vote'

// import feedbackStore from '../stores/FeedbackStore'
// import FeedbackModel from '../models/FeedbackModel'
// import Smiley from './Smiley'

interface IProp {
  question: string
  questionId: string
}

interface Smiley {
  On: boolean
  Img: string
  Type: VoteScale
}

const Question: React.FC<IProp> = ({ question }) => {
  //   const context = useContext(feedbackStore)
  const [answer, setAnswer] = useState(-1)
  const [comment, setComment] = useState(null)
  return (
    <View className='view'>
      <div className='question'>
        <h2>
          {question} - {answer}
        </h2>
      </div>
      <div className='flex-container'>
        <div
          className={answer !== 0 ? 'one smiley' : 'one smiley selected'}
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
          className={answer !== 1 ? 'two smiley' : 'two smiley selected'}
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
          className={answer !== 2 ? 'three smiley' : 'three smiley selected'}
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
          className={answer !== 3 ? 'four smiley' : 'four smiley'}
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
        .selected {
          box-sizing: border-box;
          border: 5px solid var(--label);
        }
      `}</style>
    </View>
  )
}

export default Question

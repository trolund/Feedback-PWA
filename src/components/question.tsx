// import { useContext, useState, useEffect } from 'react'
import { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { View } from 'react-view-pager'
import feedbackStore from '../stores/FeedbackStore'
import FeedbackModel from '../models/FeedbackModel'
import Bad from '../../public/images/meget_sur.png'
import VeryHappy from '../../public/images/meget_glad.png'
import Happy from '../../public/images/tilfreds.png'
import Mad from '../../public/images/sur.png'
import VoteScale from '../models/vote'

interface SmileyIcon {
  value: VoteScale
  img: string
}

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
      answer: Number(answer),
      comment,
      questionId
    }
    setFeedbackItem(feedbackItem)
  }, [answer, comment, questionId, setFeedbackItem])

  const smileys: SmileyIcon[] = [
    {
      img: Bad,
      value: VoteScale.BAD
    },
    {
      img: Mad,
      value: VoteScale.OKAY
    },
    {
      img: Happy,
      value: VoteScale.GOOD
    },
    {
      img: VeryHappy,
      value: VoteScale.GREAT
    }
  ]

  return (
    <View className='view'>
      <div className='question'>
        <h2>
          {question} - {answer}
        </h2>
      </div>
      <div className='flex-container'>
        {smileys.map(item =>
          Number(answer) === Number(item.value) ? (
            <div
              role='button'
              data-answer={item.value}
              className='smiley selected hvr-bounce-in'
              tabIndex={0}
              aria-label='zero'
              style={{ backgroundImage: `url(${item.img})` }}
              onKeyDown={e =>
                setAnswer(e.currentTarget.attributes['data-answer'].value)
              }
              onClick={e =>
                setAnswer(e.currentTarget.attributes['data-answer'].value)
              }
            />
          ) : (
            <div
              role='button'
              data-answer={item.value}
              className='smiley hvr-bounce-in'
              tabIndex={0}
              aria-label='zero'
              style={{ backgroundImage: `url(${item.img})` }}
              onKeyDown={e =>
                setAnswer(e.currentTarget.attributes['data-answer'].value)
              }
              onClick={e =>
                setAnswer(e.currentTarget.attributes['data-answer'].value)
              }
            />
          )
        )}
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
          border: 2px solid var(--surface);
          transform: perspective(1.5px) translateZ(0);
        }
        /* Bounce In */
        .hvr-bounce-in {
          display: inline-block;
          vertical-align: middle;
          transform: perspective(1px) translateZ(0);
          box-shadow: 0 0 1px rgba(0, 0, 0, 0);
          transition: all ease-in;
          transition-duration: 0.4s;
        }
        .hvr-bounce-in:hover,
        .hvr-bounce-in:focus,
        .hvr-bounce-in:active {
          transform: scale(1.2);
          transition-timing-function: cubic-bezier(0.47, 2.02, 0.31, -0.36);
        }
      `}</style>
    </View>
  )
})

export default Question

import { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react'
import { View } from 'react-view-pager'
import FeedbackModel from '../../models/FeedbackModel'
import Bad from '../../../public/images/meget_sur.png'
import VeryHappy from '../../../public/images/meget_glad.png'
import Happy from '../../../public/images/tilfreds.png'
import Mad from '../../../public/images/sur.png'
import VoteScale from '../../models/vote'
import rootStore from '../../stores/RootStore'

interface SmileyIcon {
  value: VoteScale
  img: string
}

interface IProp {
  question: string
  questionId: string
}

const Question: React.FC<IProp> = observer(({ question, questionId }) => {
  const {
    feedbackStore: { setFeedbackItem }
  } = useContext(rootStore)
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

  const smileyClick = (e: any) => {
    setAnswer(e.currentTarget.attributes['data-answer'].value)
  }

  return (
    <View className='view'>
      <div className='question'>
        <h2>{question}</h2>
      </div>
      <div className='flex-container'>
        {smileys.map(item =>
          Number(answer) === Number(item.value) ? (
            <div
              key={item.value}
              role='button'
              data-answer={item.value}
              className='smiley hvr-bounce-in'
              tabIndex={0}
              aria-label='zero'
              style={{ backgroundImage: `url(${item.img})` }}
              onKeyDown={smileyClick}
              onClick={smileyClick}
              data-cy={`scale-${item.value}`}
            />
          ) : (
            <div
              key={item.value}
              role='button'
              data-answer={item.value}
              className='smiley not-selected hvr-bounce-in'
              tabIndex={0}
              aria-label='zero'
              style={{ backgroundImage: `url(${item.img})` }}
              onKeyDown={smileyClick}
              onClick={smileyClick}
              data-cy={`scale-${item.value}`}
            />
          )
        )}
      </div>
      <textarea
        className='comment'
        value={comment}
        placeholder='Skriv dine kommentar her'
        onChange={val => setComment(val.target.value)}
        onKeyDown={e => e.stopPropagation()}
      />
      <style jsx>{`
        @media only screen and (max-width: 350px) {
          .smiley {
            min-width: 55px !important;
            min-height: 55px !important;
            margin: 2px !important;
          }
        }

        @media only screen and (orientation: landscape) {
          .comment {
            width: 70% !important;
            height: auto;
          }
        }

        .question {
          width: 100%;
          text-align: center;
          height: fit-content;
          padding-bottom: 50px;
        }
        .question h2 {
          padding-left: 10px;
          padding-right: 10px;
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
          width: 65px !important;
          height: 65px !important;
          border-radius: 50%;
          transition: filter 0.5s;
          cursor: pointer;
        }
        .smiley:hover {
          filter: contrast(2);
        }

        .smiley:focus {
          outline: 0px;
          outline: none;
        }

        .comment {
          display: block;
          text-align: left;
          height: 100px;
          margin-left: auto;
          margin-right: auto;
          width: 90%;
          color: var(--fg);
          background: var(--surface);
          display: flex;
          align-items: center;
          transition: var(--transition-colors);
          border-radius: 15px;
          margin-top: 30px;
          max-width: 80vw;
        }
        .not-selected {
          box-sizing: border-box;
          border: 5px solid var(--surface);
          opacity: 0.5;
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

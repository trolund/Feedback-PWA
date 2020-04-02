/* eslint-disable react/no-array-index-key */
import { Trash } from 'react-feather'
import Question from '../models/Question'

type QuestionListProps = {
  questionList: Question[]
  deleteFunc: (index: number) => void
  changeItemFunc: (newQuestion: string, index: number) => void
}

const QuestionList: React.FC<QuestionListProps> = ({
  questionList,
  deleteFunc,
  changeItemFunc
}) => {
  return (
    <ul>
      {questionList?.map((item, index: number) => (
        <li key={index}>
          <b>{index + 1}</b>
          <input
            type='text'
            value={item.theQuestion}
            onChange={e => changeItemFunc(e.target.value, index)}
          />
          <Trash onClick={() => deleteFunc(index)} />
        </li>
      ))}

      <style jsx>{`
        input {
          margin-left: 20px;
          margin-right: 20px;
          width: 100%;
        }
        li {
          color: var(--fg);
          padding: var(--gap-small);
          background: var(--base);
          display: flex;
          align-items: center;
          transition: var(--transition-colors);
        }

        li:not(:last-child) {
          border-bottom: 1px solid var(--divider);
        }

        h4 {
          color: var(--fg);
          margin-left: var(--gap-small);
          font-weight: 500;
          letter-spacing: 0.0035em;
        }
      `}</style>
    </ul>
  )
}

export default QuestionList

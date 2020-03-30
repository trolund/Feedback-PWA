/* eslint-disable react/no-array-index-key */
import { User as UserIcon, UserCheck, UserMinus } from 'react-feather'
import QuestionSet from '../models/QuestionSet'

type QuestionList = {
  questionSetlist: QuestionSet[]
}

const QuestionSetList: React.FC<QuestionList> = ({ questionSetlist }) => {
  return (
    <ul>
      {questionSetlist.map((item, index) => (
        <li key={index}>
          {item.name} - {item.questions.length}
        </li>
      ))}

      <style jsx>{`
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

export default QuestionSetList

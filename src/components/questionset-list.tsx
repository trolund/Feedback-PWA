/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable react/no-array-index-key */
import Link from 'next/link'
import { Trash } from 'react-feather'
import QuestionSet from '../models/QuestionSet'

type QuestionList = {
  questionSetlist: QuestionSet[]
  deleteFunc: (qSetId: string, index: number) => void
}

const QuestionSetList: React.FC<QuestionList> = ({
  questionSetlist,
  deleteFunc
}) => {
  return (
    <ul>
      {questionSetlist ? (
        questionSetlist?.map((item, index) => (
          <li key={index}>
            <Link
              href='/questionsets/[setid]'
              as={`/questionsets/${item.questionSetId}`}
            >
              <>
                {item.name} - {item.questions.length}{' '}
                <div
                  role='button'
                  tabIndex={0}
                  onClick={() => deleteFunc(item.questionSetId, index)}
                  onKeyDown={() => deleteFunc(item.questionSetId, index)}
                >
                  <Trash />
                </div>
              </>
            </Link>
          </li>
        ))
      ) : (
        <p>No content</p>
      )}

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

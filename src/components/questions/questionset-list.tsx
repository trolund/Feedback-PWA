/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable react/no-array-index-key */
import Link from 'next/link'
import { useContext } from 'react'
import { Trash } from 'react-feather'
import IQuestionSet from '../../models/QuestionSet'
import rootStore from '../../stores/RootStore'

type QuestionList = {
  questionSetlist: IQuestionSet[]
  deleteFunc: (qSetId: string, index: number) => void
}

const QuestionSetList: React.FC<QuestionList> = ({
  questionSetlist,
  deleteFunc
}) => {
  const {
    authStore: { getCompanyId }
  } = useContext(rootStore)

  return (
    <ul>
      {questionSetlist ? (
        questionSetlist?.map((item, index) => {
          return (
            <li key={index}>
              <Link
                href='/questionsets/[setid]'
                as={`/questionsets/${item?.questionSetId}`}
              >
                {}
                <a>
                  <p className='name'>{item.name}</p>
                  <span className='float-right'>
                    {(getCompanyId() === item.companyId ||
                      getCompanyId() ===
                        Number(process.env.spinOffCompenyId)) && (
                      <Trash
                        className='del-btn'
                        role='button'
                        tabIndex={0}
                        onClick={() => deleteFunc(item.questionSetId, index)}
                        onKeyDown={() => deleteFunc(item.questionSetId, index)}
                      />
                    )}
                  </span>
                </a>
              </Link>
            </li>
          )
        })
      ) : (
        <p>No content</p>
      )}

      <style jsx>{`
        .del-btn {
          float: right;
        }
        .name {
          margin-right: 20px;
          display: flex;
          float: left;
          width: 70%;
        }
        b {
          margin-right: 40px;
        }

        a {
          width: 100%;
        }

        li {
          color: var(--fg);
          padding: var(--gap-small);
          background: var(--base);
          display: flex;
          align-items: center;
          transition: var(--transition-colors);
          width: 100%;
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

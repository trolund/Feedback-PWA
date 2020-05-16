/* eslint-disable func-names */
import { useState, useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import { NextPage } from 'next'
import https from 'https'
import { observer } from 'mobx-react-lite'
import { Plus, Save } from 'react-feather'
import { useRouter } from 'next/router'
import Page from '../../components/essentials/page'
import Section from '../../components/essentials/section'
import IQuestionSet from '../../models/QuestionSet'
import FetchStates from '../../stores/requestState'
import rootStore from '../../stores/RootStore'
import QuestionListDrag from '../../components/questions/question-list-drag'
import { auth, getCompanyId } from '../../services/authService'
import ApiRoutes from '../../stores/api/ApiRoutes'
import { sortQuestionsByIndex } from '../../services/sortService'
import { makeid } from '../../services/utilsService'

type QuestionSetPageProps = {
  templeteData?: IQuestionSet
}

const QuestionSetPage: NextPage = observer(
  ({ templeteData }: QuestionSetPageProps) => {
    const router = useRouter()
    const newQset = {
      name: '',
      questions: []
    } as IQuestionSet

    const [qset, setQset] = useState(newQset)
    const {
      questionSetStore: { createQuestionSet }
    } = useContext(rootStore)

    useEffect(() => {
      if (templeteData) {
        setQset(templeteData)
      }
    }, [templeteData])

    const addQuestion = () => {
      qset.questions.push({
        theQuestion: '',
        questionId: makeid(8),
        index: qset.questions.length + 1
      })
      setQset({ ...qset, questions: [...qset.questions] })
    }

    const deleteQuestion = (index: number) => {
      qset.questions.splice(index, 1)
      setQset({ ...qset, questions: [...qset.questions] })
    }

    const itemChange = (newQuestion: string, index: number) => {
      qset.questions[index].theQuestion = newQuestion
      setQset({ ...qset, questions: [...qset.questions] })
    }

    const setQuestionSet = (questionSet: IQuestionSet) => {
      setQset(questionSet)
    }

    const removeIds = (qSet: IQuestionSet): IQuestionSet => {
      return {
        ...qSet,
        companyId: getCompanyId(),
        questionSetId: undefined,
        questions: qSet.questions.map(i => ({ ...i, questionId: undefined }))
      } as IQuestionSet
    }

    const createClickHandler = () => {
      createQuestionSet(removeIds(qset)).then(res => {
        if (res === FetchStates.DONE) {
          toast('Sæt er oprettet og nu bruges.')
          router.push('/questionsets')
        } else {
          toast('Der skete en fjel ved opretelsen, prøv igen.')
        }
      })
    }

    return (
      <Page
        title={qset?.name}
        component={
          <Save
            onClick={createClickHandler}
            style={{
              height: '20px',
              width: '20px',
              marginRight: '7px',
              marginTop: '2px'
            }}
          />
        }
      >
        <Section>
          <div className='topbar'>
            <input
              className='name'
              type='text'
              placeholder='Sæt navn'
              value={qset.name}
              onChange={e => setQset({ ...qset, name: e.target.value })}
            />
          </div>
          <QuestionListDrag
            setQuestionSet={setQuestionSet}
            questionSet={qset}
            deleteFunc={deleteQuestion}
            changeItemFunc={itemChange}
          />
          <li className='addbtn'>
            <button
              type='button'
              className='button bottombtn'
              onClick={addQuestion}
            >
              <Plus
                style={{
                  width: '20px',
                  height: '20px',
                  marginRight: '-20px',
                  float: 'left'
                }}
              />
              Tilføj spørgsmål
            </button>
          </li>
        </Section>

        <style jsx>{`
          @media only screen and (max-width: 400px) {
            .topbar {
              float: none;
            }
          }

          .addbtn {
            border-top: 1px solid var(--divider);
          }

          .name {
            margin-right: auto;
            margin-left: auto;
            width: 100%;
          }

          .topbar {
            width: 100%;
            padding: 10px;
            height: calc(2vw * 20);
            max-height: 120px;
          }
        `}</style>
      </Page>
    )
  }
)

QuestionSetPage.getInitialProps = async function(ctx) {
  const {
    query: { setid }
  } = ctx
  const token = auth(ctx)

  const options = {
    agent: new https.Agent({
      rejectUnauthorized: false // TODO fix for production with real SSL CERT
    })
  }
  const url = ApiRoutes.QuestionSetById(String(setid))
  let data: IQuestionSet | null = null
  try {
    const response = await fetch(url, {
      headers: !token ? {} : { Authorization: `Bearer ${token}` },
      ...options
    })

    data = await response.json()
    data = { ...data, questions: data.questions.sort(sortQuestionsByIndex) }
  } catch (e) {
    console.error(e)
  }
  return {
    templeteData: data
  }
}

export default QuestionSetPage

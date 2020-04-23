/* eslint-disable func-names */
import { useState, useContext, useEffect } from 'react'
import https from 'https'
import { NextPage } from 'next'
import { observer } from 'mobx-react-lite'
import { Plus, Save, Trash } from 'react-feather'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import fetch from 'isomorphic-unfetch'
import Page from '../../components/page'
import Section from '../../components/section'
import QuestionList from '../../components/question-list'
import QuestionSet from '../../models/QuestionSet'
import ApiRoutes from '../../stores/api/ApiRoutes'
import FetchStates from '../../stores/requestState'
import CustomToast from '../../components/custom-Toast'
import { auth } from '../../services/authService'
import rootStore from '../../stores/RootStore'

type pageProps = {
  initQSet: QuestionSet
}

const QuestionSetPage: NextPage = observer(({ initQSet }: pageProps) => {
  const router = useRouter()
  const { setid } = router.query
  const [qset, setQset] = useState(initQSet)
  // const [name, setName] = useState(initQSet?.name)
  const {
    questionSetStore: { fetchQuestionSet, updateQuestionSet, deleteQuestionSet }
  } = useContext(rootStore)

  useEffect(() => {
    if (qset === null) {
      fetchQuestionSet(String(setid)).then(() => {
        setQset(qset as QuestionSet)
      })
    }
  }, [fetchQuestionSet, qset, setid])

  const addQuestion = () => {
    qset.questions.push({ theQuestion: '' })
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

  const updateClickHandler = () => {
    updateQuestionSet(qset)
  }

  const deleteClickHandler = () => {
    deleteQuestionSet(qset).then(res => {
      if (res === FetchStates.DONE) {
        toast('Spørgsmåls sæt er slettet!')
        router.push('/questionsets')
      } else {
        toast('Der skete en fejl ved sletningen.')
      }
    })
  }

  return (
    <Page
      title={qset?.name}
      component={
        <button type='button' onClick={updateClickHandler}>
          <Save
            style={{
              height: '20px',
              width: '20px',
              marginRight: '7px',
              marginTop: '2px'
            }}
          />
          Gem
        </button>
      }
    >
      <CustomToast />
      <Section>
        <div className='topbar'>
          <input
            className='float-left name'
            type='text'
            placeholder='Sæt navn'
            value={qset.name}
            onChange={e => setQset({ ...qset, name: e.target.value })}
          />
          {/* <Picker
            optionGroups={companies.optionGroups}
            valueGroups={companies.valueGroups}
            
          /> */}
        </div>
        <QuestionList
          questionList={qset?.questions}
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
        <hr
          style={{ width: '120px', marginLeft: 'auto', marginRight: 'auto' }}
        />
        <li>
          <button
            type='button'
            className='button bottombtn'
            onClick={deleteClickHandler}
          >
            <Trash
              style={{
                width: '20px',
                height: '20px',
                marginRight: '-20px',
                float: 'left'
              }}
            />
            slet
          </button>
        </li>
      </Section>

      <style jsx>{`
        @media only screen and (max-width: 400px) {
          .topbar {
            float: none;
          }
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
})

QuestionSetPage.getInitialProps = async function(ctx) {
  const { query } = ctx
  const token = auth(ctx)
  const { setid } = query

  const options = {
    agent: new https.Agent({
      rejectUnauthorized: false // TODO fix for production with real SSL CERT
    })
  }
  const url = ApiRoutes.QuestionSetById(String(setid))
  let data: QuestionSet | null = null
  try {
    const response = await fetch(url, {
      headers: !token ? {} : { Authorization: `Bearer ${token}` },
      ...options
    })
    data = await response.json()
  } catch (e) {
    console.error(e)
  }
  return {
    initQSet: data
  }
}

export default QuestionSetPage

/* eslint-disable func-names */
import { useState, useContext, useEffect } from 'react'
import { NextPage } from 'next'
import { observer } from 'mobx-react-lite'
import { Plus } from 'react-feather'
import { useRouter } from 'next/router'
import cookies from 'next-cookies'
import fetch from 'isomorphic-unfetch'
import Page from '../../components/page'
import Section from '../../components/section'
import QuestionList from '../../components/question-list'

import QuestionSet from '../../models/QuestionSet'
import ApiRoutes from '../../stores/api/ApiRoutes'
import questionSetStore from '../../stores/QuestionSetStore'

type pageProps = {
  initQSet: QuestionSet
}

const QuestionSetPage: NextPage = observer(({ initQSet }: pageProps) => {
  const router = useRouter()
  const { setid } = router.query
  const [qset, setQset] = useState(initQSet)
  const [name, setMame] = useState(initQSet?.name)
  const { fetchQuestionSet, state, qSet } = useContext(questionSetStore)

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

  return (
    <Page title={qset?.name} component={<Plus onClick={addQuestion} />}>
      <Section>
        <div className='topbar'>
          <button type='button' className='button float-right'>
            Gem
          </button>

          <input
            className='float-left name'
            type='text'
            placeholder='Sæt navn'
            value={name}
            onChange={e => setMame(e.target.value)}
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
      </Section>

      <style jsx>{`
        @media only screen and (max-width: 400px) {
          .name {
            margin-right: auto;
            margin-left: auto;
            text-align: center;
            float: none;
          }

          .topbar {
            float: none;
          }
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
  const { jwttoken } = cookies(ctx)
  const { query } = ctx
  const { setid } = query
  const url = ApiRoutes.QuestionSetById(String(setid))
  let data: QuestionSet | null = null
  try {
    const response = await fetch(url, {
      headers: !jwttoken ? {} : { Authorization: `Bearer ${jwttoken}` }
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

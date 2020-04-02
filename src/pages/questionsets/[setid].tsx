import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import { observer } from 'mobx-react-lite'
import { Plus } from 'react-feather'
import Page from '../../components/page'
import Section from '../../components/section'
import QuestionList from '../../components/question-list'
import questionSetStore from '../../stores/QuestionSetStore'
import QuestionSet from '../../models/QuestionSet'

const QuestionSetPage: NextPage = observer(() => {
  const router = useRouter()
  const { setid } = router.query
  const [name, setname] = useState('')
  const [qset, setQset] = useState({} as QuestionSet)
  const { fetchQuestionSet, state, qSet } = useContext(questionSetStore)

  useEffect(() => {
    fetchQuestionSet(String(setid)).then(() => {
      setQset(qset as QuestionSet)
    })
  }, [fetchQuestionSet, qset, setid])

  const addQuestion = () => {
    qset.questions.push({ theQuestion: '' })
    setQset({ ...qSet, questions: [...qset.questions] })
  }

  const deleteQuestion = (index: number) => {
    qset.questions.splice(index, 1)
    setQset({ ...qSet, questions: [...qset.questions] })
  }

  const itemChange = (newQuestion: string, index: number) => {
    qset.questions[index].theQuestion = newQuestion
    setQset({ ...qSet, questions: [...qset.questions] })
  }

  return (
    <Page title='Nyt spørgsmålssæt' component={<Plus onClick={addQuestion} />}>
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
            onChange={e => setname(e.target.value)}
          />
          {/* <Picker
            optionGroups={companies.optionGroups}
            valueGroups={companies.valueGroups}
            
          /> */}
        </div>
        <QuestionList
          questionList={qset.questions}
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

QuestionSetPage.getInitialProps = async function() {
  const res = await fetch('https://api.tvmaze.com/search/shows?q=batman')
  const data = await res.json()

  console.log(`Show data fetched. Count: ${data.length}`)

  return {
    shows: data.map(entry => entry.show)
  }
}

export default QuestionSet

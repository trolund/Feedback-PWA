/* eslint-disable func-names */
import { useState, useContext } from 'react'
import { NextPage } from 'next'
import { observer } from 'mobx-react-lite'
import { Plus, Save } from 'react-feather'
import Page from '../../components/page'
import Section from '../../components/section'
import QuestionList from '../../components/question-list'

import QuestionSet from '../../models/QuestionSet'
import questionSetStore from '../../stores/QuestionSetStore'

const QuestionSetPage: NextPage = observer(() => {
  const newQset = {
    name: '',
    questions: []
  } as QuestionSet
  const [qset, setQset] = useState(newQset)
  const { createQuestionSet } = useContext(questionSetStore)

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

  const createClickHandler = () => {
    createQuestionSet(qset)
  }

  return (
    <Page title={qset?.name} component={<Plus onClick={addQuestion} />}>
      <Section>
        <div className='topbar'>
          <button
            type='button'
            className='button float-right'
            onClick={createClickHandler}
          >
            <Save
              style={{
                height: '20px',
                width: '20px',
                marginRight: '7px',
                marginTop: '2px'
              }}
            />
            Opret
          </button>
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

export default QuestionSetPage

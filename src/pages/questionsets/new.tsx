import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Plus } from 'react-feather'
import Page from '../../components/page'
import Section from '../../components/section'
import QuestionList from '../../components/question-list'
import Question from '../../models/Question'

const NewQuestionSet = observer(() => {
  const initlist: Question[] = [
    { theQuestion: 'hej' },
    { theQuestion: 'hej' },
    { theQuestion: 'hej' },
    { theQuestion: 'hej' }
  ]

  const [name, setname] = useState('')
  const [list, setList] = useState(initlist)

  const addQuestion = () => {
    list.push({ theQuestion: '' })
    setList([...list])
  }

  const deleteQuestion = (index: number) => {
    list.splice(index, 1)
    setList([...list])
  }

  const itemChange = (newQuestion: string, index: number) => {
    list[index].theQuestion = newQuestion
    setList([...list])
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
          questionList={list}
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

export default NewQuestionSet

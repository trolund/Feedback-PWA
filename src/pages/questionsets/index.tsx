import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Plus } from 'react-feather'
import Page from '../../components/page'
import Section from '../../components/section'
import QuestionSetList from '../../components/questionset-list'
import QuestionSet from '../../models/QuestionSet'

const AllQuestionSets = observer(() => {
  const initlist: QuestionSet[] = [
    { name: 'item', questionSetId: '', questions: [] },
    { name: 'item', questionSetId: '', questions: [] },
    { name: 'item', questionSetId: '', questions: [] }
  ]
  const [list, setList] = useState(initlist)

  const addQuestion = () => {
    list.push({ name: 'new', questionSetId: null, questions: [] })
    setList([...list])
  }

  const deleteQuestion = (index: number) => {
    list.splice(index, 1)
    setList([...list])
  }

  const itemChange = (newQuestion: string, index: number) => {
    list[index].name = newQuestion
    setList([...list])
  }

  return (
    <Page title='Nyt spørgsmålssæt' component={<Plus onClick={addQuestion} />}>
      <Section>
        <QuestionSetList questionSetlist={list} />
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

export default AllQuestionSets

import { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Plus } from 'react-feather'
import Page from '../../components/page'
import Section from '../../components/section'
import QuestionSetList from '../../components/questionset-list'
import QuestionSet from '../../models/QuestionSet'
import questionSetStore from '../../stores/QuestionSetStore'

const AllQuestionSets = observer(() => {
  const { fetchQuestionSetNames, QSetNames } = useContext(questionSetStore)

  const initlist: QuestionSet[] = [
    { name: 'item', questionSetId: '', questions: [] },
    { name: 'item', questionSetId: '', questions: [] },
    { name: 'item', questionSetId: '', questions: [] }
  ]
  const [list, setList] = useState(initlist)

  useEffect(() => {
    fetchQuestionSetNames().then(() => {
      setList(QSetNames)
    })
  }, [QSetNames, fetchQuestionSetNames])

  const addQuestion = () => {
    list.push({ name: 'new', questionSetId: null, questions: [] })
    setList([...list])
  }

  const deleteQuestion = (qSetId: string, index: number) => {
    list.splice(index, 1)
    setList([...list])
  }

  // const onItemClick = (qSetId: string) => {
  //   Router.push(`/questionsets/${qSetId}`)
  // }

  return (
    <Page title='Alle spørgsmålssæt' component={<Plus onClick={addQuestion} />}>
      <Section>
        <QuestionSetList questionSetlist={list} deleteFunc={deleteQuestion} />
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

/* eslint-disable func-names */
import { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { observer } from 'mobx-react-lite'
import { Plus, Save } from 'react-feather'
import { useRouter } from 'next/router'
import Page from '../../components/page'
import Section from '../../components/section'
import QuestionSet from '../../models/QuestionSet'
import FetchStates from '../../stores/requestState'
import withAuth from '../../services/withAuth'
import rootStore from '../../stores/RootStore'
import QuestionListDrag from '../../components/question-list-drag'

const QuestionSetPage = withAuth(
  observer(() => {
    const router = useRouter()
    const newQset = {
      name: '',
      questions: []
    } as QuestionSet
    const [qset, setQset] = useState(newQset)
    const {
      questionSetStore: { createQuestionSet }
    } = useContext(rootStore)

    const makeid = length => {
      let result = ''
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const charactersLength = characters.length
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        )
      }
      return result
    }

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

    const setQuestionSet = (questionSet: QuestionSet) => {
      setQset(questionSet)
    }

    const removeIds = (qSet: QuestionSet): QuestionSet => {
      return {
        ...qSet,
        questions: qSet.questions.map(i => ({ ...i, questionId: undefined }))
      } as QuestionSet
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
            {/* <Picker
            optionGroups={companies.optionGroups}
            valueGroups={companies.valueGroups}
            
          /> */}
          </div>
          {/* <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='list'>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <QuestionList
                    key={provided.innerRef}
                    {...provided.droppableProps}
                    questionList={qset?.questions}
                    deleteFunc={deleteQuestion}
                    changeItemFunc={itemChange}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext> */}
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
  })
)

export default QuestionSetPage

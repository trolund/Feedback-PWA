import React, { useContext, useState, useEffect } from 'react'
import { Trash, MoreVertical } from 'react-feather'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { observer } from 'mobx-react'
import IQuestion from '../../models/Question'
import IQuestionSet from '../../models/QuestionSet'
import rootStore from '../../stores/RootStore'

const reorder = (list: IQuestion[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const updateIndex = (list: IQuestion[]): IQuestion[] => {
  return list.map((question, index) => ({ ...question, index } as IQuestion))
}

type QuestionItemProps = {
  question: IQuestion
  index: number
  deleteFunc: (index: number) => void
  changeItemFunc: (newQuestion: string, index: number) => void
  qSet: IQuestionSet
}

const QuestionItem = ({
  question,
  index,
  changeItemFunc,
  deleteFunc,
  qSet
}: QuestionItemProps) => {
  const {
    authStore: { getCompanyId }
  } = useContext(rootStore)

  // used to show or hide based on company ID
  const [showElement, setShowElement] = useState(false)

  useEffect(() => {
    const showBasedOnCompany = () =>
      getCompanyId() === qSet.companyId ||
      getCompanyId() === Number(process.env.spinOffCompenyId)

    setShowElement(showBasedOnCompany())
  }, [getCompanyId, qSet.companyId])

  return (
    <Draggable draggableId={question?.questionId} index={index}>
      {provided => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <MoreVertical color='var(--surface)' />
          <MoreVertical
            style={{ marginLeft: '-14px' }}
            color='var(--surface)'
          />
          <input
            type='text'
            value={question.theQuestion}
            style={{ marginRight: showElement ? '20px' : '0px' }}
            onChange={e => changeItemFunc(e.target.value, index)}
          />
          <Trash
            onClick={() => deleteFunc(index)}
            style={{ display: showElement ? 'block' : 'none' }}
          />
          <style jsx>{`
            input {
              margin-left: 20px;
              width: 100%;
            }
            li {
              color: var(--fg);
              padding: var(--gap-small);
              background: var(--base);
              display: flex;
              align-items: center;
              transition: var(--transition-colors);
            }
            li:not(:last-child) {
              border-bottom: 1px solid var(--divider);
            }
          `}</style>
        </li>
      )}
    </Draggable>
  )
}

type ListDragProps = {
  questionSet: IQuestionSet
  deleteFunc: (index: number) => void
  changeItemFunc: (newQuestion: string, index: number) => void
  setQuestionSet: (questionSet: IQuestionSet) => void
}

const QuestionListDrag = observer(
  ({
    questionSet,
    setQuestionSet,
    deleteFunc,
    changeItemFunc
  }: ListDragProps) => {
    const onDragEnd = result => {
      // dropped outside the list
      if (!result.destination) {
        return
      }
      const items = reorder(
        questionSet.questions,
        result.source.index,
        result.destination.index
      )

      setQuestionSet({ ...questionSet, questions: updateIndex(items) })
    }

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='list'>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {questionSet.questions.map(
                (question: IQuestion, index: number) => (
                  <QuestionItem
                    qSet={questionSet}
                    question={question}
                    index={index}
                    key={question.questionId}
                    deleteFunc={deleteFunc}
                    changeItemFunc={changeItemFunc}
                  />
                )
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <style jsx>{`
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
      </DragDropContext>
    )
  }
)

export default QuestionListDrag

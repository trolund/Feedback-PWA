import React, { useContext } from 'react'
import { Trash, MoreVertical } from 'react-feather'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
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

function QuestionItem({
  question,
  index,
  changeItemFunc,
  deleteFunc,
  qSet
}: QuestionItemProps) {
  const {
    authStore: { getCompanyId }
  } = useContext(rootStore)
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
            onChange={e => changeItemFunc(e.target.value, index)}
          />
          {(getCompanyId() === qSet.companyId ||
            getCompanyId() === Number(process.env.spinOffCompenyId)) && (
            <Trash onClick={() => deleteFunc(index)} />
          )}
          <style jsx>{`
            input {
              margin-left: 20px;
              margin-right: 20px;
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

type ListProps = {
  questions: IQuestion[]
  deleteFunc: (index: number) => void
  changeItemFunc: (newQuestion: string, index: number) => void
}

// const QuoteList = React.memo(function List(props: ListProps) {
//   const { questions, deleteFunc, changeItemFunc } = props
//   return questions.map((question: Question, index: number) => (
//     <QuestionItem
//       question={question}
//       index={index}
//       key={question.questionId}
//       deleteFunc={deleteFunc}
//       changeItemFunc={changeItemFunc}
//     />
//   ))
// })

// const QuoteList = ({ questions, deleteFunc, changeItemFunc }: ListProps) =>
//   questions.map((question: Question, index: number) => (
//     <QuestionItem
//       question={question}
//       index={index}
//       key={question.questionId}
//       deleteFunc={deleteFunc}
//       changeItemFunc={changeItemFunc}
//     />
//   ))

type ListDragProps = {
  questionSet: IQuestionSet
  deleteFunc: (index: number) => void
  changeItemFunc: (newQuestion: string, index: number) => void
  setQuestionSet: (questionSet: IQuestionSet) => void
}

function QuestionListDrag({
  questionSet,
  setQuestionSet,
  deleteFunc,
  changeItemFunc
}: ListDragProps) {
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
            {questionSet.questions.map((question: IQuestion, index: number) => (
              <QuestionItem
                qSet={questionSet}
                question={question}
                index={index}
                key={question.questionId}
                deleteFunc={deleteFunc}
                changeItemFunc={changeItemFunc}
              />
            ))}
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

export default QuestionListDrag

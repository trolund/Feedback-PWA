/* eslint-disable react/no-array-index-key */
import { Trash } from 'react-feather'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import IQuestion from '../../models/Question'
import IQuestionSet from '../../models/QuestionSet'

type QuestionListProps = {
  questionList: IQuestion[]
  deleteFunc: (index: number) => void
  changeItemFunc: (newQuestion: string, index: number) => void
  qset: IQuestionSet
  setQset: (questionSet: IQuestionSet) => void
}

const QuestionList: React.FC<QuestionListProps> = props => {
  const { questionList, deleteFunc, changeItemFunc } = props

  const reorder = (list: IQuestion[], startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    const items = reorder(
      props.qset.questions,
      result.source.index,
      result.destination.index
    )

    props.setQset({ ...props.qset, questions: items })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='list'>
        {provided => (
          <ul ref={provided.innerRef} {...provided.droppableProps}>
            {questionList?.map((item, index: number) => (
              <Draggable draggableId='qusestionList' index={index} key={index}>
                {providedx => (
                  <li
                    ref={providedx.innerRef}
                    {...providedx.draggableProps}
                    {...providedx.dragHandleProps}
                  >
                    <b>{index + 1}</b>
                    <input
                      type='text'
                      value={item.theQuestion}
                      onChange={e => changeItemFunc(e.target.value, index)}
                    />
                    <Trash onClick={() => deleteFunc(index)} />
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
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

export default QuestionList

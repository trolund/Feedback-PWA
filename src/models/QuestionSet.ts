import Question from './Question'

export default interface QuestionSet {
  questionSetId?: string
  name: string
  questions: Question[]
}

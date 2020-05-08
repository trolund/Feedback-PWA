import Question from './Question'

export default interface QuestionSet {
  questionSetId?: string
  name: string
  companyId: number
  questions: Question[]
}

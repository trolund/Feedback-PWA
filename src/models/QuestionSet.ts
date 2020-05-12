import IQuestion from './Question'

export default interface IQuestionSet {
  questionSetId?: string
  name: string
  companyId: number
  questions: IQuestion[]
}

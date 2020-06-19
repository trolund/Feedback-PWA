import Comment from './Comment'

export default interface Feedback {
  questionIndex?: number
  questionId?: string
  question: string
  voteAVG: number
  comments: Comment[]
}

import FeedbackModel from './FeedbackModel'

export default interface FeedbackBatch {
  meetingId: number
  userFingerprint: string
  feedback: FeedbackModel[]
  QuestionSet: string
}

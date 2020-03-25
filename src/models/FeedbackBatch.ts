import FeedbackModel from './FeedbackModel'

export default interface FeedbackBatch {
  meetingId: number
  feedback: FeedbackModel[]
}

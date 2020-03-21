import states from '../requestState'
import FeedbackBatch from '../../models/FeedbackBatch'
import FeedbackModel from '../../models/FeedbackModel'
import QuestionSet from '../../models/QuestionSet'

export interface InitialDataFeedback {
  state: states
  msg: string
  feedbackBatch: FeedbackBatch[]
  feedback: FeedbackModel[]
}

export interface InitialDataQuestion {
  fetchState: states
  msg: string
  questions: QuestionSet | {}
}

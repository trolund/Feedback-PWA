import FetchStates from '../requestState'
import FeedbackBatch from '../../models/FeedbackBatch'
import FeedbackModel from '../../models/FeedbackModel'
import IQuestionSet from '../../models/QuestionSet'

export interface InitialDataFeedback {
  state: FetchStates
  msg: string
  feedbackBatch: FeedbackBatch[]
  feedback: FeedbackModel[]
}

export interface InitialDataQuestion {
  fetchState: FetchStates
  msg: string
  questions: IQuestionSet | {}
}

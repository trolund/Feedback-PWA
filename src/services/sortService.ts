/* eslint-disable import/prefer-default-export */
import IQuestion from '../models/Question'
import MeetingModel from '../models/MeetingModel'
import Feedback from '../models/Feedback'

export const sortQuestionsByIndex = (a: IQuestion, b: IQuestion) => {
  if (a.index < b.index) {
    return -1
  }
  if (b.index < a.index) {
    return 1
  }
  return 0
}

export const sortFeedbackByQuestionsIndex = (a: Feedback, b: Feedback) => {
  if (a.questionIndex < b.questionIndex) {
    return -1
  }
  if (a.questionIndex > b.questionIndex) {
    return 1
  }
  return 0
}

export const sortEventByDate = (a: MeetingModel, b: MeetingModel) =>
  new Date(a.startTime).getTime() - new Date(b.startTime).getTime()

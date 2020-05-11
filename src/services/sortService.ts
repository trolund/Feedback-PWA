/* eslint-disable import/prefer-default-export */
import Question from '../models/Question'
import MeetingModel from '../models/MeetingModel'

export const sortQuestionsByIndex = (a: Question, b: Question) => {
  if (a.index < b.index) {
    return -1
  }
  if (b.index < a.index) {
    return 1
  }
  return 0
}

export const sortEventByDate = (a: MeetingModel, b: MeetingModel) =>
  new Date(a.startTime).getTime() - new Date(b.startTime).getTime()

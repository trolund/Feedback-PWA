/* eslint-disable import/prefer-default-export */
import Question from '../models/Question'

export const sortQuestionsByIndex = (a: Question, b: Question) => {
  if (a.index < b.index) {
    return -1
  }
  if (b.index < a.index) {
    return 1
  }
  return 0
}

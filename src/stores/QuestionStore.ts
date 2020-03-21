import { observable, action } from 'mobx'
import { createContext } from 'react'
import states from './requestState'
// import authService from "../components/api-authorization/AuthorizeService";

import QuestionSet from '../models/QuestionSet'
import ApiRoutes from './api/ApiRoutes'
// import questionTestData from './api/DummyData/questionTestData.json'

class QuestionStore {
  @observable fetchState = null

  @observable msg = null

  // data
  @observable questions: QuestionSet = null

  @action fetchQuestions = async (meetingId: string): Promise<states> => {
    this.fetchState = states.LOADING
    try {
      const url = ApiRoutes.FetchQuestions(meetingId)

      const response = await fetch(url)

      this.msg = response.statusText

      const data = await response.json()

      // const data: QuestionSet = questionTestData

      this.questions = data
      this.fetchState = states.DONE
      return states.DONE
    } catch (e) {
      this.fetchState = states.FAILED
      this.msg = e.statusText ?? 'meeting not found or not open for feedback'
      this.questions = null
      return states.FAILED
    }
  }
}

// decorate(QuestionStore, {
//   questions: observable,
//   fetchQuestions: action
// })

const questionStore = createContext(new QuestionStore())

export default questionStore

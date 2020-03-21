import { observable, configure, action } from 'mobx'
import { createContext } from 'react'
import states from './requestState'

// import authService from "../components/api-authorization/AuthorizeService";
import questionTestData from './api/DummyData/questionTestData.json'
import QuestionSet from '../models/QuestionSet'
import ApiRoutes from './api/ApiRoutes'

configure({ enforceActions: true })

class QuestionStore {
  @observable fetchState = null

  @observable msg = null

  // data
  @observable questions: QuestionSet = null

  constructor() {
    this.fetchState = states.DONE
    this.msg = ''
    this.questions = null
  }

  @action fetchQuestions = async (meetingId: string) => {
    this.fetchState = states.LOADING
    try {
      const url = ApiRoutes.FetchQuestions(meetingId)

      const response = await fetch(url)

      this.msg = response.statusText

      // const data = await response.json()

      const data: QuestionSet = questionTestData

      this.questions = data
      this.fetchState = states.DONE
    } catch (e) {
      this.fetchState = states.FAILED

      console.log(e)

      this.msg = e.statusText ?? 'meeting not found or not open for feedback'
      this.questions = null
    }
  }
}

// decorate(QuestionStore, {
//   questions: observable,
//   fetchQuestions: action
// })

const questionStore = createContext(new QuestionStore())

export default questionStore

import { observable, action } from 'mobx'
import { createContext } from 'react'
import states from './requestState'
import QuestionSet from '../models/QuestionSet'
import ApiRoutes from './api/ApiRoutes'
// import questionTestData from './api/DummyData/questionTestData.json'

class QuestionStore {
  @observable fetchState: states | null = null

  @observable msg = null

  @observable meetingId = null

  // data
  @observable questions: QuestionSet = {
    name: 'unnown',
    questionSetId: '',
    questions: []
  }

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
      this.meetingId = meetingId
      return states.DONE
    } catch (e) {
      this.fetchState = states.FAILED
      this.msg = e.statusText ?? 'meeting not found or not open for feedback'
      this.questions = null
      this.meetingId = null
      return states.FAILED
    }
  }

  @action isMeetingOpen = async (meetingId: string): Promise<boolean> => {
    this.fetchState = states.LOADING
    try {
      const url = ApiRoutes.isMeetingOpen(meetingId)

      const response = await fetch(url)

      this.msg = response.statusText

      // const data = await response.json()

      this.fetchState = states.DONE
      this.meetingId = meetingId
      if (response.status === 200) {
        return true
      }
      return false
    } catch (e) {
      this.fetchState = states.FAILED
      this.msg = e.statusText ?? 'meeting not found or not open for feedback'
      this.questions = null
      this.meetingId = null
      return false
    }
  }
}

// decorate(QuestionStore, {
//   questions: observable,
//   fetchQuestions: action
// })

const questionStore = createContext(new QuestionStore())

export default questionStore

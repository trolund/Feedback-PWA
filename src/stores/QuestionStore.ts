import { observable, action } from 'mobx'
//  import RootStore from './RootStore'
import FetchStates from './requestState'
import QuestionSet from '../models/QuestionSet'
import ApiRoutes from './api/ApiRoutes'

// import questionTestData from './api/DummyData/questionTestData.json'

export default class QuestionStore {
  @observable fetchState: FetchStates | null = null

  @observable msg = null

  @observable meetingId = null

  // data
  @observable questions: QuestionSet = null

  @action fetchQuestions = async (
    meetingId: string,
    fingerprint: string
  ): Promise<number> => {
    this.fetchState = FetchStates.LOADING
    try {
      const url = ApiRoutes.FetchQuestions(meetingId)
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fingerprint)
      })

      this.msg = response.statusText

      const data: QuestionSet = await response.json()

      if ('msg' in data) {
        this.questions = null
      } else {
        this.questions = data
      }

      this.fetchState = FetchStates.DONE
      this.meetingId = meetingId
      return response.status
    } catch (e) {
      this.fetchState = FetchStates.FAILED
      this.msg = e.statusText
      this.questions = null
      this.meetingId = null
      return e
    }
  }

  @action isMeetingOpen = async (meetingId: string): Promise<boolean> => {
    this.fetchState = FetchStates.LOADING
    try {
      const url = ApiRoutes.isMeetingOpen(meetingId)

      const response = await fetch(url)

      this.msg = response.statusText

      // const data = await response.json()

      this.fetchState = FetchStates.DONE
      this.meetingId = meetingId
      if (response.status === 200) {
        return true
      }
      return false
    } catch (e) {
      this.fetchState = FetchStates.FAILED
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

// const questionStore = createContext(new QuestionStore())

// export default questionStore

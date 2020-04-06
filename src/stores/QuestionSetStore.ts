import { observable, action } from 'mobx'
import { createContext } from 'react'
import states from './requestState'
import QuestionSet from '../models/QuestionSet'
import ApiRoutes from './api/ApiRoutes'
import AuthService from './api/authService'

class QuestionSetStore {
  // status
  @observable state = states.DONE

  msg = ''

  // data
  @observable QSetNames: QuestionSet[] = []

  @observable qSet: QuestionSet | null = null

  constructor() {
    this.fetchQuestionSetNames()
  }

  @action fetchQuestionSetNames = async () => {
    this.state = states.LOADING
    try {
      const url = ApiRoutes.QuestionSetNames
      const token = AuthService.getToken()

      const response = await fetch(url, {
        headers: !token ? {} : { Authorization: `Bearer ${token}` }
      })
      this.msg = response.statusText

      const data: QuestionSet[] = await response.json()
      this.QSetNames = data
    } catch (e) {
      this.state = states.FAILED
      this.msg = e.statusText
      this.QSetNames = []
    }
  }

  @action fetchQuestionSet = async (questionId: string) => {
    this.state = states.LOADING
    try {
      const url = ApiRoutes.QuestionSetById(questionId)
      const token = AuthService.getToken()

      const response = await fetch(url, {
        headers: !token ? {} : { Authorization: `Bearer ${token}` }
      })
      this.msg = response.statusText

      const data: QuestionSet = await response.json()
      this.qSet = data
    } catch (e) {
      this.state = states.FAILED
      this.msg = e.statusText
      this.qSet = null
    }
  }
}

// decorate(QuestionSetStore, {
//   QSetNames: observable
// })

const questionSetStore = createContext(new QuestionSetStore())

export default questionSetStore

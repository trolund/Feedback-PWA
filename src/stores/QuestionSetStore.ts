import { observable, action } from 'mobx'
import FetchStates from './requestState'
import QuestionSet from '../models/QuestionSet'
import ApiRoutes from './api/ApiRoutes'
import { getToken } from '../services/authService'

export default class QuestionSetStore {
  // status
  @observable state = FetchStates.DONE

  msg = ''

  // data
  @observable QSetNames: QuestionSet[] = []

  @observable qSet: QuestionSet | null = null

  constructor() {
    this.fetchQuestionSetNames()
  }

  @action fetchQuestionSetNames = async () => {
    this.state = FetchStates.LOADING
    try {
      const url = ApiRoutes.QuestionSetNames
      const token = getToken()

      const response = await fetch(url, {
        headers: !token ? {} : { Authorization: `Bearer ${token}` }
      })
      this.msg = response.statusText

      const data: QuestionSet[] = await response.json()
      this.QSetNames = data
    } catch (e) {
      this.state = FetchStates.FAILED
      this.msg = e.statusText
      this.QSetNames = []
    }
  }

  @action fetchQuestionSet = async (questionId: string) => {
    this.state = FetchStates.LOADING
    try {
      const url = ApiRoutes.QuestionSetById(questionId)
      const token = getToken()

      const response = await fetch(url, {
        headers: !token ? {} : { Authorization: `Bearer ${token}` }
      })
      this.msg = response.statusText

      const data: QuestionSet = await response.json()
      this.qSet = data
    } catch (e) {
      this.state = FetchStates.FAILED
      this.msg = e.statusText
      this.qSet = null
    }
  }

  @action updateQuestionSet = async (entity: QuestionSet) => {
    this.state = FetchStates.LOADING
    try {
      const url = ApiRoutes.updateQuestionSet
      const token = getToken()
      const json = JSON.stringify(entity)

      const response = await fetch(url, {
        method: 'POST',
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
        body: json,
        redirect: 'follow'
      })
      this.msg = response.statusText
    } catch (e) {
      this.state = FetchStates.FAILED
      this.msg = e.statusText
    }
  }

  @action deleteQuestionSet = async (entity: QuestionSet) => {
    this.state = FetchStates.LOADING
    try {
      const url = ApiRoutes.updateQuestionSet
      const token = getToken()
      const json = JSON.stringify(entity)

      const response = await fetch(url, {
        method: 'DELETE',
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
        body: json,
        redirect: 'follow'
      })
      this.msg = response.statusText
      return FetchStates.DONE
    } catch (e) {
      this.state = FetchStates.FAILED

      this.msg = e.statusText
      return FetchStates.FAILED
    }
  }

  @action createQuestionSet = async (entity: QuestionSet) => {
    this.state = FetchStates.LOADING
    try {
      const url = ApiRoutes.updateQuestionSet
      const token = getToken()
      const json = JSON.stringify(entity)

      const response = await fetch(url, {
        method: 'PUT',
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
        body: json,
        redirect: 'follow'
      })
      this.msg = response.statusText
      return FetchStates.DONE
    } catch (e) {
      this.state = FetchStates.FAILED
      this.msg = e.statusText
      return FetchStates.FAILED
    }
  }
}

// const questionSetStore = createContext(new QuestionSetStore())

// export default questionSetStore

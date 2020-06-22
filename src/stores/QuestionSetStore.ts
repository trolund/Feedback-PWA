import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'
import FetchStates from './requestState'
import IQuestionSet from '../models/QuestionSet'
import ApiRoutes from './api/ApiRoutes'
import { getToken } from '../services/authService'
import { sortQuestionsByIndex } from '../services/sortService'

import QuestionSet from '../models/classes/QuestionSet'
import IStoreFetchState from './StoreFetchState'

export default class QuestionSetStore implements IStoreFetchState {
  // status
  @observable fetchState = FetchStates.DONE

  @observable msg = ''

  // data
  @persist('list', QuestionSet) @observable QSetNames: IQuestionSet[] = []

  // @persist('object', QuestionSet)
  @observable qSet: IQuestionSet | null = null

  @action clear = () => {
    this.QSetNames = []
    this.qSet = null
  }

  @action setQSet = (val: IQuestionSet | null) => {
    this.qSet = val
  }

  @action fetchQuestionSetNames = async () => {
    this.fetchState = FetchStates.LOADING
    try {
      const url = ApiRoutes.QuestionSetNames
      const token = getToken()

      const response = await fetch(url, {
        method: 'GET',
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
      })
      this.msg = response.statusText

      const data: IQuestionSet[] = await response.json()
      this.QSetNames = data
      // console.log(this.msg, this.QSetNames)

      this.fetchState = FetchStates.DONE
    } catch (e) {
      this.fetchState = FetchStates.FAILED
      this.msg = e.statusText
      this.QSetNames = []
    }
  }

  @action fetchQuestionSet = async (questionId: string) => {
    this.fetchState = FetchStates.LOADING
    try {
      const url = ApiRoutes.QuestionSetById(questionId)
      const token = getToken()

      const response = await fetch(url, {
        headers: !token ? {} : { Authorization: `Bearer ${token}` }
      })
      this.msg = response.statusText

      const data: IQuestionSet = await response.json()
      this.qSet = {
        ...data,
        questions: data.questions.sort(sortQuestionsByIndex)
      }
    } catch (e) {
      this.fetchState = FetchStates.FAILED
      this.msg = e.statusText
      this.qSet = null
    }
  }

  @action updateQuestionSet = async (
    entity: IQuestionSet
  ): Promise<FetchStates> => {
    this.fetchState = FetchStates.LOADING
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

      if (response.status === 200) {
        this.fetchState = FetchStates.DONE
        return FetchStates.DONE
      }
      this.fetchState = FetchStates.FAILED
      return FetchStates.FAILED
    } catch (e) {
      this.fetchState = FetchStates.FAILED
      this.msg = e.statusText
      return FetchStates.FAILED
    }
  }

  @action deleteQuestionSet = async (entity: IQuestionSet) => {
    this.fetchState = FetchStates.LOADING
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
      if (response.status === 200) {
        return FetchStates.DONE
      }
      return FetchStates.FAILED
    } catch (e) {
      this.fetchState = FetchStates.FAILED

      this.msg = e.statusText
      return FetchStates.FAILED
    }
  }

  @action createQuestionSet = async (entity: IQuestionSet) => {
    this.fetchState = FetchStates.LOADING
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
      if (response.status === 200) {
        this.fetchState = FetchStates.DONE
        return FetchStates.DONE
      }
      this.fetchState = FetchStates.FAILED
      return FetchStates.FAILED
    } catch (e) {
      this.fetchState = FetchStates.FAILED
      this.msg = e.statusText
      return FetchStates.FAILED
    }
  }
}

// const questionSetStore = createContext(new QuestionSetStore())

// export default questionSetStore

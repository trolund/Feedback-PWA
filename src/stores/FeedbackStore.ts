import { observable, action } from 'mobx'
import { createContext } from 'react'
import FetchStates from './requestState'
import FeedbackBatch from '../models/FeedbackBatch'
import ApiRoutes from './api/ApiRoutes'
import FeedbackModel from '../models/FeedbackModel'
import { getToken } from '../services/authService'

// import authService from '../components/api-authorization/AuthorizeService'

export default class FeedbackStore {
  // status
  @observable state = FetchStates.DONE

  @observable msg = ''

  // data
  @observable feedbackBatch: FeedbackBatch[] = []

  @observable feedback: FeedbackModel[] = []

  @action setFeedbackItem = (item: FeedbackModel) => {
    const oldElm = this.feedback.find(f => f.questionId === item.questionId)

    if (oldElm) {
      this.feedback = this.feedback.map(f =>
        f.questionId !== item.questionId ? f : item
      )
    } else {
      this.feedback.push(item)
    }
  }

  @action fetchFeedback = async (meetingId: string) => {
    this.state = FetchStates.LOADING
    try {
      const url = ApiRoutes.Feedbackbatch(meetingId)

      const token = getToken()

      const response = await fetch(url, {
        method: 'GET',
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
        redirect: 'follow'
      })
      this.msg = response.statusText

      const data: FeedbackBatch[] = await response.json()

      this.feedbackBatch = data
    } catch (e) {
      this.state = FetchStates.FAILED
      this.msg = e.statusText
      this.feedbackBatch = null
    }
  }

  @action createFeedbackBatch = async (
    feedback: FeedbackModel[],
    meetingId: string
  ) => {
    this.state = FetchStates.LOADING

    try {
      const url = ApiRoutes.CreateFeedbackBatch()
      const json = JSON.stringify({ meetingId, feedback })
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: json,
        redirect: 'follow'
      })

      this.msg = response.statusText
      this.state = FetchStates.DONE
      // const data = await response.json()
      return FetchStates.DONE
    } catch (e) {
      this.state = FetchStates.FAILED
      this.msg = e.statusText
      return FetchStates.FAILED
    }
  }
}

// decorate(FeedbackStore, {
//   feedbackBatch: observable
// })

// const feedbackStore = createContext(new FeedbackStore())

// export default feedbackStore

import { decorate, observable } from 'mobx'
import { createContext } from 'react'
import states from './requestState'
import FeedbackBatch from '../models/FeedbackBatch'
import ApiRoutes from './api/ApiRoutes'
import FeedbackModel from '../models/FeedbackModel'

// import authService from '../components/api-authorization/AuthorizeService'

class FeedbackStore {
  // status
  state = states.DONE

  msg = ''

  // data
  feedbackBatch: FeedbackBatch[] | null = null

  feedback: FeedbackModel[] = []

  async fetchFeedback(meetingId: string) {
    this.state = states.LOADING
    try {
      const url = `Api/FeedbackBatch/${meetingId}` // ApiRoutes.Feedbackbatch(meetingId);

      const token = '' // await authService.getAccessToken()

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
      this.state = states.FAILED
      this.msg = e.statusText
      this.feedbackBatch = null
    }
  }

  async createFeedbackBatch(feedback: FeedbackModel[], meetingId: string) {
    this.state = states.LOADING

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

      // const data = await response.json()
    } catch (e) {
      this.state = states.FAILED
      this.msg = e.statusText
    }
  }
}

decorate(FeedbackStore, {
  feedbackBatch: observable
})

const feedbackStore = createContext(new FeedbackStore())

export default feedbackStore

import { observable, action } from 'mobx'
import { createContext } from 'react'
import states from './requestState'
import FeedbackBatch from '../models/FeedbackBatch'
import ApiRoutes from './api/ApiRoutes'
import FeedbackModel from '../models/FeedbackModel'
import AuthService from './api/authService'

// import authService from '../components/api-authorization/AuthorizeService'

class FeedbackStore {
  // status
  @observable state = states.DONE

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
    this.state = states.LOADING
    try {
      const url = ApiRoutes.Feedbackbatch(meetingId)

      const token = AuthService.getToken()

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

  @action createFeedbackBatch = async (
    feedback: FeedbackModel[],
    meetingId: string
  ) => {
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
      this.state = states.DONE
      // const data = await response.json()
      return states.DONE
    } catch (e) {
      this.state = states.FAILED
      this.msg = e.statusText
      return states.FAILED
    }
  }
}

// decorate(FeedbackStore, {
//   feedbackBatch: observable
// })

const feedbackStore = createContext(new FeedbackStore())

export default feedbackStore

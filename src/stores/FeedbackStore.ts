import { observable, action } from 'mobx'
import cookies from 'js-cookie'
import FetchStates from './requestState'
import FeedbackBatch from '../models/FeedbackBatch'
import ApiRoutes from './api/ApiRoutes'
import FeedbackModel from '../models/FeedbackModel'
import { getToken } from '../services/authService'
import IStoreFetchState from './StoreFetchState'
import Question from '../components/feedback/question'

// import authService from '../components/api-authorization/AuthorizeService'

export default class FeedbackStore implements IStoreFetchState {
  // status
  @observable fetchState = FetchStates.DONE

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

  @action setFeedbackBatch = (data: FeedbackBatch[]) => {
    if (data != null) {
      this.feedbackBatch = data
    }
  }

  @action fetchFeedback = async (meetingId: string) => {
    this.fetchState = FetchStates.LOADING
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
      this.fetchState = FetchStates.FAILED
      this.msg = e.statusText
      this.feedbackBatch = null
    }
  }

  @action createFeedbackBatch = async (
    feedback: FeedbackModel[],
    meetingId: string,
    fingerprint: string,
    questionSetId: string
  ) => {
    this.fetchState = FetchStates.LOADING

    try {
      const url = ApiRoutes.CreateFeedbackBatch()
      const json = JSON.stringify({
        meetingId,
        feedback,
        userFingerprint: fingerprint,
        questionSetId
      })
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: json,
        redirect: 'follow'
      })
      this.msg = response.statusText

      // every thing seme to go as planed :)
      if (response.status === 200) {
        this.fetchState = FetchStates.DONE
        return FetchStates.DONE
      }

      // the ser dit not produce status code 200 and feedback was not safely deliverd.
      this.fetchState = FetchStates.FAILED
      return FetchStates.FAILED
    } catch (e) {
      this.fetchState = FetchStates.FAILED
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

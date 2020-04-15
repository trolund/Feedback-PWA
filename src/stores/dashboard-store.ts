import { observable, action } from 'mobx'
import { createContext } from 'react'
import ApiRoutes from './api/ApiRoutes'
import FetchStates from './requestState'
import FeedbackDate from '../models/FeedbackDate'
import GraphXScale from '../models/GraphXScale'
import { getToken } from '../services/authService'

class DashboardStore {
  @observable startdate: Date = new Date('2019-01-08T10:09:30.000Z')

  @observable enddate: Date = new Date()

  @observable cutoff: boolean = true

  @observable useFixedYAxis: boolean = true

  @observable xAxisScale: GraphXScale = GraphXScale.weeks

  @observable useSkipZero: boolean = true

  @observable searchWord: string = ''

  @observable tags: string[] = []

  @observable ownData: boolean = true

  @observable rating: number = 0

  // status
  @observable state = FetchStates.DONE

  @observable msg = ' '

  // data
  @observable data: FeedbackDate[] | null = null

  @action setXAxisScale = (value: GraphXScale) => {
    this.xAxisScale = value
  }

  @action setStartdate = (newDate: Date) => {
    this.startdate = newDate
  }

  @action setEnddate = (newDate: Date) => {
    this.enddate = newDate
  }

  @action setOwnData = (bool: boolean) => {
    this.ownData = bool
  }

  @action setCutOff = (bool: boolean) => {
    this.cutoff = bool
  }

  @action setFixedYAxis = (bool: boolean) => {
    this.useFixedYAxis = bool
  }

  @action setSearchWord = (word: string) => {
    this.searchWord = word
  }

  @action setSkipZero = (value: boolean) => {
    this.useSkipZero = value
  }

  @action setTags = (tags: string[]) => {
    console.log('set tags:', tags)

    this.tags = tags
  }

  @action setState = (state: FetchStates) => {
    this.state = state
  }

  @action fetchRating = async () => {
    this.state = FetchStates.LOADING
    try {
      const url = ApiRoutes.userRating
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

      const data: number = await response.json()
      this.state = FetchStates.DONE
      this.rating = data
    } catch (e) {
      this.state = FetchStates.FAILED
      this.msg = e.statusText
      this.data = null
    }
  }

  // async fetchDashboard(
  //   start: Date,
  //   end: Date,
  //   categories?: string[],
  //   searchWord?: string
  // ) {
  //   this.state = states.LOADING
  //   try {
  //     const url = ApiRoutes.DashboardMonth(start, end, categories, searchWord)

  //     const token = AuthService.getToken()

  //     const response = await fetch(url, {
  //       method: 'GET',
  //       headers: !token
  //         ? {}
  //         : {
  //             Authorization: `Bearer ${token}`,
  //             'Content-Type': 'application/json'
  //           },
  //       redirect: 'follow'
  //     })
  //     this.msg = response.statusText

  //     const data: FeedbackMonth[] = await response.json()
  //     this.state = states.DONE
  //     this.data = data
  //   } catch (e) {
  //     this.state = states.FAILED
  //     this.msg = e.statusText
  //     this.data = null
  //   }
  // }

  @action fetchDashboardDate = async (
    start: Date,
    end: Date,
    categories?: string[],
    searchWord?: string,
    ownData?: boolean
  ) => {
    this.state = FetchStates.LOADING
    try {
      const url = ApiRoutes.DashboardDate(
        start,
        end,
        categories,
        searchWord,
        ownData
      )

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

      const data: FeedbackDate[] = await response.json()
      this.state = FetchStates.DONE

      this.data = data
    } catch (e) {
      this.state = FetchStates.FAILED

      this.msg = e.statusText
      this.data = null
    }
  }
}

const dashboardStore = createContext(new DashboardStore())

export default dashboardStore

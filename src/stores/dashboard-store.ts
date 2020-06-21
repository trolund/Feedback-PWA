/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import { observable, action, computed } from 'mobx'
import Moment from 'moment'
// import { createContext } from 'react'
import { persist } from 'mobx-persist'
import ApiRoutes from './api/ApiRoutes'
import FetchStates from './requestState'
import FeedbackDate from '../models/FeedbackDate'
import GraphXScale from '../models/GraphXScale'
import { getToken } from '../services/authService'
import IOptionsValue from '../models/OptionsValue'
import OptionsValue from '../models/classes/OptionsValue'
import { applyOffSet } from '../services/dateService'
import IStoreFetchState from './StoreFetchState'

export default class DashboardStore implements IStoreFetchState {
  @persist @observable showFilter: boolean = false

  @persist @observable startdateValue: number = new Date(
    '2019-01-08T10:09:30.000Z'
  ).getTime()

  @persist @observable enddateValue: number = new Date().getTime()

  @persist @observable cutoff: boolean = true

  @persist @observable useFixedYAxis: boolean = true

  @persist @observable xAxisScale: GraphXScale = GraphXScale.weeks

  @persist @observable useSkipZero: boolean = true

  @persist @observable searchWord: string = ''

  @persist('list', OptionsValue) @observable tags: IOptionsValue[] = []

  @persist @observable ownData: boolean = true

  @persist @observable rating: number = 0

  // status
  @observable fetchState = FetchStates.DONE

  @observable msg = ''

  // data
  @observable data: FeedbackDate[] = []

  @action clear = () => {
    this.showFilter = false
    this.startdateValue = new Date('2019-01-08T10:09:30.000Z').getTime()
    this.enddateValue = new Date().getTime()
    this.cutoff = true
    this.useFixedYAxis = true
    this.xAxisScale = GraphXScale.weeks
    this.useSkipZero = true
    this.searchWord = ''
    this.tags = []
    this.ownData = true
    this.rating = 0
  }

  @computed get startdate() {
    return new Date(this.startdateValue)
  }

  @action setStartdate = (date: Date) => {
    this.startdateValue = date.getTime()
  }

  @computed get enddate() {
    return new Date(this.enddateValue)
  }

  @action setEnddate = (date: Date) => {
    this.enddateValue = date.getTime()
  }

  @action setShowFilter = (value: boolean) => {
    this.showFilter = value
  }

  @action setXAxisScale = (value: GraphXScale) => {
    this.xAxisScale = value
  }

  // @action setStartdate = (newDate: Date) => {
  //   this.startdate = newDate
  // }

  // @action setEnddate = (newDate: Date) => {
  //   this.enddate = newDate
  // }

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

  @action setTags = (tags: IOptionsValue[]) => {
    this.tags = tags.filter(i => i) // make sure to not have null values
  }

  @action setState = (state: FetchStates) => {
    this.fetchState = state
  }

  @action fetchRating = async () => {
    this.fetchState = FetchStates.LOADING
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
      this.fetchState = FetchStates.DONE
      this.rating = data
    } catch (e) {
      this.fetchState = FetchStates.FAILED
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
    this.fetchState = FetchStates.LOADING
    try {
      const url = ApiRoutes.DashboardDate(
        applyOffSet(
          Moment(start)
            .utc(true)
            .toDate()
        ),
        applyOffSet(
          Moment(end)
            .utc(true)
            .toDate()
        ),
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
      this.fetchState = FetchStates.DONE

      this.data = data
    } catch (e) {
      this.fetchState = FetchStates.FAILED

      this.msg = e.statusText
      this.data = null
    }
  }
}

// const dashboardStore = createContext(new DashboardStore())

// const dashboardStore = (): Context<DashboardStore> => {
//   let store = null
//   if (typeof window === 'undefined') {
//     store = new DashboardStore()
//     return createContext(store)
//   }
//   if (store === null) {
//     const hydrate = create({
//       storage: localStorage,
//       jsonify: true
//     })
//     hydrate('dashboardStore', store).then(() =>
//       console.log('dashboardStore has been hydrated')
//     )
//   }

//   return createContext(store)
// }

// export default dashboardStore

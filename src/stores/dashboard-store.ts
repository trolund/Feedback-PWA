import { observable } from 'mobx'
import { createContext } from 'react'
import ApiRoutes from './api/ApiRoutes'
import states from './requestState'
import AuthService from './api/authService'
import FeedbackDate from '../models/FeedbackDate'

class DashboardStore {
  // status
  @observable state = states.DONE

  @observable msg = ' '

  // data
  @observable data: FeedbackDate[] | null = null

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

  async fetchDashboardDate(
    start: Date,
    end: Date,
    categories?: string[],
    searchWord?: string
  ) {
    this.state = states.LOADING
    try {
      const url = ApiRoutes.DashboardDate(start, end, categories, searchWord)

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

      const data: FeedbackDate[] = await response.json()
      this.state = states.DONE
      this.data = data
    } catch (e) {
      this.state = states.FAILED
      this.msg = e.statusText
      this.data = null
    }
  }
}

const dashboardStore = createContext(new DashboardStore())

export default dashboardStore

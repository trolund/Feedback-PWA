import { decorate, observable } from 'mobx'
import states from './requestState'
import authService from '../components/api-authorization/AuthorizeService'
import { createContext } from 'react'

const baseUrl =
  process.env.NODE_ENV === 'development' ? process.env.REACT_APP_BASE_URL : '' //Check if dev

class UsersStore {
  // status
  state = states.DONE
  msg = ''

  // data
  users = ['Loading giraffes']

  constructor() {
    //this.fetchUsers();
  }

  async fetchUsers() {
    this.state = states.LOADING
    try {
      const url =
        baseUrl + '/ByDate?start=2015-03-25T12:00:00Z&end=2015-03-25T12:00:00Z'
      const token = await authService.getAccessToken()

      const response = await fetch(url, {
        headers: !token ? {} : { Authorization: `Bearer ${token}` }
      })
      console.log(response)
      this.msg = response.statusText

      const data = await response.json()
      this.users = data
    } catch (e) {
      this.state = states.FAILED
      this.msg = e.statusText
      this.users = []
    }
  }
}

decorate(UsersStore, {
  users: observable
})

export const usersStore = createContext(new UsersStore())

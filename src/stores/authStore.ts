import { observable, computed, action } from 'mobx'
import { createContext } from 'react'
import User from '../models/User'
import states from './requestState'
import ApiRoutes from './api/ApiRoutes'

class AuthStore {
  @observable state: states = states.DONE

  @observable msg: string = ''

  @observable user: User = null

  @computed getToken = (): string => {
    return this.user.token
  }

  constructor() {
    this.user = { token: localStorage.getItem('token') }
  }

  @action login = async (email: string, password: string) => {
    this.state = states.LOADING
    try {
      const url = ApiRoutes.login

      const json = JSON.stringify({ email, password, rememberMe: true })

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: json
      })

      this.msg = response.statusText

      this.user = await response.json()
      localStorage.setItem('token', this.user.token)
      this.state = states.DONE
      return states.DONE
    } catch (e) {
      this.state = states.FAILED
      this.msg = e.statusText ?? 'User not found'
      this.user = null
      return states.FAILED
    }
  }
}

const authStore = createContext(new AuthStore())

export default authStore

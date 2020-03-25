import { observable, computed, action } from 'mobx'
import { createContext } from 'react'
import User from '../models/User'
import states from './requestState'
import ApiRoutes from './api/ApiRoutes'
import Registration from '../models/Registration'

class AuthStore {
  @observable state: states = states.DONE

  @observable msg: string = ''

  @observable user: User = null

  @observable token: string = null

  // @computed getToken = (): string => {
  //   return this.user.token
  // }

  @action setState = (state: states) => {
    this.state = state
  }

  @action getUser = (): User => {
    const json = localStorage.getItem('user')
    return JSON.parse(json)
  }

  @action login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    this.state = states.LOADING
    try {
      const url = ApiRoutes.login

      const json = JSON.stringify({ email, password, rememberMe })

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: json
      })

      this.msg = response.statusText

      if (response.status === 200) {
        this.user = await response.json()
        this.token = this.user.token
        localStorage.setItem('token', this.user.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        this.state = states.DONE
        return states.DONE
      }
      this.state = states.FAILED
      return states.FAILED
    } catch (e) {
      this.msg = e.statusText ?? 'User not found'
      this.user = null
      this.state = states.FAILED
      return states.FAILED
    }
  }

  @action createUser = async (model: Registration) => {
    // this.state = states.LOADING
    try {
      const url = ApiRoutes.createUser

      const json = JSON.stringify(model)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: json
      })

      this.msg = response.statusText

      this.user = await response.json()
      // this.state = states.DONE
      // this.setState(states.DONE)
      return states.DONE
    } catch (e) {
      // this.setState(states.FAILED)
      this.msg = e.statusText ?? 'User not Created'
      this.user = null
      // this.state = states.FAILED
      return states.FAILED
    }
  }
}

const authStore = createContext(new AuthStore())

export default authStore

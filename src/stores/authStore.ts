import { observable, action } from 'mobx'
import { Cookies } from 'react-cookie'
import { createContext } from 'react'
import User from '../models/User'
import FetchStates from './requestState'
import ApiRoutes from './api/ApiRoutes'
import Registration from '../models/Registration'
import { login, getToken, logout } from '../services/authService'

class AuthStore {
  cookies = new Cookies()

  @observable state: FetchStates = FetchStates.DONE

  @observable msg: string = ''

  @observable user: User = null

  @observable token: string = null

  // @computed getToken = (): string => {
  //   return this.user.token
  // }

  @action setState = (state: FetchStates) => {
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
    this.state = FetchStates.LOADING
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

        login({ token: this.user.token })

        // localStorage.setItem('token', this.user.token)
        // localStorage.setItem('user', JSON.stringify(this.user))

        // this.cookies.set('jwttoken', this.user.token)
        this.state = FetchStates.DONE
        return FetchStates.DONE
      }
      this.state = FetchStates.FAILED
      return FetchStates.FAILED
    } catch (e) {
      this.msg = e.statusText ?? 'User not found'
      this.user = null
      this.state = FetchStates.FAILED
      return FetchStates.FAILED
    }
  }

  @action signout = async () => {
    this.state = FetchStates.LOADING
    try {
      const url = ApiRoutes.signout

      const token = getToken()

      const response = await fetch(url, {
        method: 'POST',
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
      })

      this.msg = response.statusText

      logout()
      this.user = null

      this.state = FetchStates.DONE
      return FetchStates.DONE
    } catch (e) {
      this.msg = e.statusText ?? 'User not signout'
      this.user = null
      localStorage.setItem('token', null)
      localStorage.setItem('user', null)
      this.cookies.set('jwttoken', null)
      this.state = FetchStates.FAILED
      return FetchStates.FAILED
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
      return FetchStates.DONE
    } catch (e) {
      // this.setState(states.FAILED)
      this.msg = e.statusText ?? 'User not Created'
      this.user = null
      // this.state = states.FAILED
      return FetchStates.FAILED
    }
  }
}

const authStore = createContext(new AuthStore())

export default authStore

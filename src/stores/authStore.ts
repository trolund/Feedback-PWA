import { observable, action } from 'mobx'
import { Cookies } from 'react-cookie'
import JwtDecode from 'jwt-decode'
import User from '../models/User'
import FetchStates from './requestState'
import ApiRoutes from './api/ApiRoutes'
import Registration from '../models/Registration'
import { login, getToken, logout } from '../services/authService'
import TokenModel from '../models/TokenModel'

export default class AuthStore {
  cookies = new Cookies()

  @observable state: FetchStates = FetchStates.DONE

  @observable msg: string = ''

  @observable user: User = null

  @observable token: string = null

  @observable isAdmin: boolean = null

  @observable isVAdmin: boolean = null

  @observable isFacilitator: boolean = null

  // @computed getToken = (): string => {
  //   return this.user.token
  // }

  @action setState = (state: FetchStates) => {
    this.state = state
  }

  @action setRoles = (
    isAdmin: boolean,
    isFacilitator: boolean,
    isVAdmin: boolean
  ) => {
    console.log(isAdmin, isFacilitator, isVAdmin)

    this.isAdmin = isAdmin
    this.isFacilitator = isFacilitator
    this.isVAdmin = isVAdmin
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
    this.msg = ''
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
        localStorage.setItem('user', JSON.stringify(this.user))
        this.msg = `Velkommen! ${this.user.firstname}`

        this.token = this.user.token
        const token: TokenModel = JwtDecode(this.user.token)

        this.isFacilitator = token.role.includes('Facilitator')
        this.isVAdmin = token.role.includes('VAdmin')
        this.isAdmin = token.role.includes('Admin')

        login({ token: this.user.token })
        this.state = FetchStates.DONE
        return FetchStates.DONE
      }

      if (response.status === 500) {
        this.msg = 'Server problem, kontakt Administator.'
        this.state = FetchStates.FAILED
        return FetchStates.FAILED
      }

      if (response.status === 403) {
        this.msg = 'Email eller password er forkert, prøv igen'
        this.state = FetchStates.FAILED
        return FetchStates.FAILED
      }

      this.msg = 'Ukendt fejl, kontakt Administator.'
      this.state = FetchStates.FAILED
      return FetchStates.FAILED
    } catch (e) {
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

// const authStore = createContext(new AuthStore())

// export default authStore

import { observable, action } from 'mobx'
import { Cookies } from 'react-cookie'
import { persist } from 'mobx-persist'
import JwtDecode from 'jwt-decode'
import IUser from '../models/User'
import FetchStates from './requestState'
import ApiRoutes from './api/ApiRoutes'
import Registration from '../models/Registration'
import { login, getToken, logout } from '../services/authService'
import TokenModel from '../models/TokenModel'
import NewPasswordModel from '../models/NewPasswordModel'
import User from '../models/classes/User'
import Fingerprint from '../models/classes/Fingerprint'

export default class AuthStore {
  cookies = new Cookies()

  @observable state: FetchStates = FetchStates.DONE

  @observable msg: string = ''

  @persist('object', User) @observable user: IUser = null

  @persist @observable token: string = null

  @persist('object', Fingerprint) @observable fingerprint: Fingerprint = null

  @observable isAdmin: boolean = null

  @observable isVAdmin: boolean = null

  @observable isFacilitator: boolean = null

  // @computed getToken = (): string => {
  //   return this.user.token
  // }

  @action setState = (state: FetchStates) => {
    this.state = state
  }

  @action setFingerprint = (newFingerprint: string) => {
    this.fingerprint = new Fingerprint(newFingerprint)
  }

  @action setRoles = (
    isAdmin: boolean,
    isFacilitator: boolean,
    isVAdmin: boolean
  ) => {
    this.isAdmin = isAdmin
    this.isFacilitator = isFacilitator
    this.isVAdmin = isVAdmin
  }

  @action getUser = (): IUser => {
    return this.user
  }

  @action setUser = (input: IUser) => {
    this.user = input
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

  @action updatePassword = async (model: NewPasswordModel) => {
    this.state = FetchStates.LOADING
    try {
      const url = ApiRoutes.updateUserPassword

      const json = JSON.stringify(model)

      const token = getToken()

      const response = await fetch(url, {
        method: 'POST',
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
        body: json
      })

      this.msg = response.statusText
      if (response.status === 200) {
        this.state = FetchStates.DONE
        return FetchStates.DONE
      }
      this.state = FetchStates.FAILED
      return FetchStates.FAILED
    } catch (e) {
      this.msg = e.statusText
      this.state = FetchStates.FAILED
      return FetchStates.FAILED
    }
  }

  @action updateUserInfo = async (model: IUser) => {
    this.state = FetchStates.LOADING
    try {
      const url = ApiRoutes.updateUserInfo

      const json = JSON.stringify(model)

      const token = getToken()

      const response = await fetch(url, {
        method: 'POST',
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
        body: json
      })

      this.msg = response.statusText
      if (response.status === 200) {
        this.state = FetchStates.DONE
        return response.json() as IUser
      }
      this.state = FetchStates.FAILED
      return null
    } catch (e) {
      this.msg = e.statusText
      this.state = FetchStates.FAILED
      return null
    }
  }
}

// const authStore = createContext(new AuthStore())

// export default authStore

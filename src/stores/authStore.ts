import { observable, action } from 'mobx'
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
import { logEvent } from '../utils/analytics'
import IStoreFetchState from './StoreFetchState'
import { ThirdPartyDraggable } from '@fullcalendar/interaction'

export default class AuthStore implements IStoreFetchState {
  @observable fetchState: FetchStates = FetchStates.DONE

  @observable msg: string = ''

  @persist('object', User) @observable user: IUser = null

  @persist @observable token: string = null

  // @persist('object', Fingerprint) @observable fingerprint: Fingerprint = null

  @persist @observable isAdmin: boolean = null

  @persist @observable isVAdmin: boolean = null

  @persist @observable isFacilitator: boolean = null

  // @computed getToken = (): string => {
  //   return this.user.token
  // }

  @action clear = () => {
    this.user = null
    this.token = null
    this.isAdmin = null
    this.isFacilitator = null
    this.isVAdmin = null
  }

  @action setState = (state: FetchStates) => {
    this.fetchState = state
  }

  // @action setFingerprint = (newFingerprint: string) => {
  //   this.fingerprint = new Fingerprint(newFingerprint)
  // }

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

  @action setMsg = (msg: string) => {
    this.msg = msg
  }

  @action setUser = (input: IUser) => {
    this.user = input
  }

  getCompanyId = (): number => {
    return this?.user?.companyId
  }

  @action login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    this.fetchState = FetchStates.LOADING
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
        logEvent('Login', 'login success', 200, email)
        this.user = await response.json()
        // localStorage.setItem('user', JSON.stringify(this.user))
        this.msg = `Velkommen! ${this.user.firstname}`

        this.token = this.user.token
        const token: TokenModel = JwtDecode(this.user.token)

        this.isFacilitator = token.role.includes('Facilitator')
        this.isVAdmin = token.role.includes('VAdmin')
        this.isAdmin = token.role.includes('Admin')

        login({ token: this.user.token })
        this.fetchState = FetchStates.DONE
        return FetchStates.DONE
      }

      if (response.status === 500) {
        logEvent('Login', 'login error - 500', 500, email)
        this.msg = 'Server problem, kontakt Administator.'
        this.fetchState = FetchStates.FAILED
        return FetchStates.FAILED
      }

      if (response.status === 403) {
        this.msg = 'Email eller password er forkert, prøv igen'
        logEvent('Login', 'login error - 403', 403, email)
        this.fetchState = FetchStates.FAILED
        return FetchStates.FAILED
      }
      logEvent('Login', 'login error - unknown', 0, email)
      this.msg = 'Ukendt fejl, kontakt Administator.'
      this.fetchState = FetchStates.FAILED
      return FetchStates.FAILED
    } catch (e) {
      logEvent('Login', 'login error - unknown', 0, email)
      this.user = null
      this.fetchState = FetchStates.FAILED
      return FetchStates.FAILED
    }
  }

  @action signout = async () => {
    this.fetchState = FetchStates.LOADING
    try {
      // const url = ApiRoutes.signout

      // const token = getToken()

      // const response = await fetch(url, {
      //   method: 'POST',
      //   headers: !token
      //     ? {}
      //     : {
      //         Authorization: `Bearer ${token}`,
      //         'Content-Type': 'application/json'
      //       }
      // })

      // this.msg = response.statusText

      logout()
      this.user = null

      this.fetchState = FetchStates.DONE
      return FetchStates.DONE
    } catch (e) {
      this.msg = e.statusText ?? 'User not signout'
      this.user = null
      // localStorage.setItem('token', null)
      // localStorage.setItem('user', null)
      this.fetchState = FetchStates.FAILED
      return FetchStates.FAILED
    }
  }

  @action createUser = async (model: Registration): Promise<number> => {
    this.fetchState = FetchStates.LOADING
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

      this.msg = await response.text()

      if (response.status === 200) {
        this.fetchState = FetchStates.DONE
      } else {
        this.fetchState = FetchStates.FAILED
      }

      return response.status
    } catch (e) {
      // this.setState(states.FAILED)
      this.msg = e.statusText ?? 'User not Created'
      this.user = null
      this.fetchState = FetchStates.FAILED
      return 0
    }
  }

  @action updatePassword = async (model: NewPasswordModel) => {
    this.fetchState = FetchStates.LOADING
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
        this.fetchState = FetchStates.DONE
        return FetchStates.DONE
      }
      this.fetchState = FetchStates.FAILED
      return FetchStates.FAILED
    } catch (e) {
      this.msg = e.statusText
      this.fetchState = FetchStates.FAILED
      return FetchStates.FAILED
    }
  }

  @action updateUserInfo = async (model: IUser) => {
    this.fetchState = FetchStates.LOADING
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
        this.fetchState = FetchStates.DONE
        return response.json() as IUser
      }
      this.fetchState = FetchStates.FAILED
      return null
    } catch (e) {
      this.msg = e.statusText
      this.fetchState = FetchStates.FAILED
      return null
    }
  }
}

// const authStore = createContext(new AuthStore())

// export default authStore

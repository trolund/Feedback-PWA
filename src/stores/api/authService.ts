import Router from 'next/router'
import jwtDecode from 'jwt-decode'
import { Cookies } from 'react-cookie'
import TokenModel from '../../models/TokenModel'

const cookies = new Cookies()

class AuthService {
  isServer = () => typeof window === 'undefined'

  getToken = (): string => {
    try {
      const token = cookies.get('jwttoken')
      if (token) {
        return token
      }
      Router.push('/login')
      return null
    } catch (e) {
      console.log(e)
    }
    Router.push('/login')
    return null
  }

  logout = () => {
    try {
      localStorage.setItem('token', null)
      Router.push('/')
    } catch (e) {
      console.error(e)
    }
  }

  parseJwt = (token: string) => {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => {
          return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`
        })
        .join('')
    )
    return JSON.parse(jsonPayload)
  }

  redirectToLogin = () => {
    if (!this.isServer) {
      try {
        const obj: any = jwtDecode(localStorage.getItem('token'))
        if (obj) {
          const date: number = obj.exp
          if (date <= Date.now() / 1000) Router.push('/login')
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  redirectToHome = () => {
    if (!this.isServer()) {
      try {
        const obj: any = jwtDecode(localStorage.getItem('token'))
        if (obj) {
          const date: number = obj.exp
          if (date >= Date.now() / 1000) Router.push('/home')
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  tokenValid = (token: string) => {
    try {
      const obj: any = jwtDecode(token)
      if (obj) {
        const date: number = obj.exp
        return date >= Date.now() / 1000
      }
    } catch (e) {
      console.error(e)
    }
    return false
  }

  savedTokenValid = () => {
    try {
      const obj: any = jwtDecode(this.getToken())
      if (obj) {
        const date: number = obj.exp
        return date >= Date.now() / 1000
      }
    } catch (e) {
      console.error(e)
    }
    return false
  }

  // tokenValid = (): boolean => {
  //   if (!this.isServer) {
  //     try {
  //       const obj: any = jwtDecode(localStorage.getItem('token'))
  //       if (obj) {
  //         const date: number = obj.exp
  //         return date >= Date.now() / 1000
  //       }
  //       return false
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   }
  //   return null
  // }

  getRoles = (): string[] => {
    const token: TokenModel = this?.parseJwt(this.getToken())
    return token.role
  }

  getUserId = (): string => {
    const token: TokenModel = this?.parseJwt(this.getToken())
    return token.sub
  }

  getExp = (): number => {
    const token: TokenModel = this?.parseJwt(this.getToken())
    console.log('exp:', token.exp)
    return token.exp
  }

  getCompanyId = (): number => {
    const token: TokenModel = this?.parseJwt(this.getToken())
    console.log('CID:', token.CID)
    return token.CID
  }

  getTokenModel = (): TokenModel => {
    const token: TokenModel = this?.parseJwt(this.getToken())
    return token
  }
}

const authService = new AuthService()

export default authService

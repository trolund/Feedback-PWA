import Router from 'next/router'
import jwtDecode from 'jwt-decode'
import TokenModel from '../../models/TokenModel'

class AuthService {
  getToken = (): string => {
    try {
      const token = localStorage.getItem('token')
      return token
    } catch (e) {
      console.log(e)
    }
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

  redirectToHome = () => {
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

  tokenValid = (): boolean => {
    try {
      const obj: any = jwtDecode(localStorage.getItem('token'))
      if (obj) {
        const date: number = obj.exp
        return date >= Date.now() / 1000
      }
      return false
    } catch (e) {
      console.log(e)
    }
    return null
  }

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

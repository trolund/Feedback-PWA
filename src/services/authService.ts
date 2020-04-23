import jwtDecode from 'jwt-decode'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import TokenModel from '../models/TokenModel'

const TOKENKEY = 'token'

export const login = ({ token }) => {
  cookie.set(TOKENKEY, token, { expires: 1 })
  Router.push('/home')
}

export const auth = ctx => {
  const { token } = nextCookie(ctx)

  // If there's no token, it means the user is not logged in.
  if (!token) {
    if (typeof window === 'undefined') {
      ctx.res.writeHead(302, { Location: '/login' })
      ctx.res.end()
    } else {
      Router.push('/login')
    }
  }

  return token
}

export const logout = () => {
  cookie.remove(TOKENKEY)
  // to support logging out from all windows
  window.localStorage.setItem('logout', JSON.stringify(Date.now()))
  Router.push('/login')
}

export const getToken = (): string => {
  const token = cookie.get(TOKENKEY)
  return token
}

export const getCompanyId = (tokenInput?: string): number => {
  const tokenStr = tokenInput || cookie.get(TOKENKEY)
  try {
    const token: TokenModel = jwtDecode(tokenStr)
    return token.CID
  } catch (e) {
    console.debug(e)
    return -1
  }
}

export const tokenValid = (token: string) => {
  try {
    const obj: any = jwtDecode(token)
    if (obj) {
      const date: number = obj.exp
      console.log(date, Date.now() / 1000)

      return date >= Date.now() / 1000
    }
  } catch (e) {
    console.error(e)
  }
  return false
}

export const getRoles = (): string[] => {
  try {
    const token: TokenModel = jwtDecode(getToken())
    return token.role
  } catch (e) {
    console.log(e)
    return []
  }
}

// export const isAdmin = (): boolean => {
//   const token: TokenModel = jwtDecode(cookie.get(TOKENKEY))
//   return token.role.includes('Admin')
// }

// export const isVAdmin = (): boolean => {
//   const token: TokenModel = jwtDecode(cookie.get(TOKENKEY))
//   return token.role.includes('VAdmin')
// }

// export const isFacilitator = (): boolean => {
//   const token: TokenModel = jwtDecode(getToken())
//   return token.role.includes('Facilitator')
// }

export const getUserId = (): string => {
  const token: TokenModel = jwtDecode(getToken())
  return token.sub
}

export const savedTokenValid = () => {
  try {
    const obj: any = jwtDecode(getToken())
    if (obj) {
      const date: number = obj.exp
      return date >= Date.now() / 1000
    }
  } catch (e) {
    console.error(e)
  }
  return false
}

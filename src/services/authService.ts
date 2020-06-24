import jwtDecode from 'jwt-decode'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import { NextPageContext } from 'next'
import TokenModel from '../models/TokenModel'
import Roles from '../models/enums/roles'

const TOKENKEY = 'token'

const safeRedirect = (destination: string, ctx: NextPageContext) => {
  if (typeof window === 'undefined') {
    ctx.res.writeHead(302, { Location: destination })
    ctx.res.end()
  } else {
    Router.push(destination)
  }
}

export const login = ({ token }) => {
  cookie.set(TOKENKEY, token, { expires: 1 })
  Router.push('/home')
}

export const tokenValid = (token: string): boolean => {
  try {
    const obj: any = jwtDecode(token)
    if (obj) {
      const date: number = obj.exp
      return date >= Date.now() / 1000
    }
  } catch (e) {
    return false
  }
  return false
}

// returns true if the user does not have the roles to get access to the page.
const noAccess = (roles: Roles[], tokenObj: TokenModel) => {
  return !roles
    .map(
      requiredRole =>
        roles.includes(requiredRole) && !tokenObj.role.includes(requiredRole)
    )
    .includes(false)
}

const blockWithRoles = (
  roles: Roles[],
  tokenObj: TokenModel,
  ctx: NextPageContext
) => {
  // If roles is present check premisions
  if (roles) {
    if (noAccess(roles, tokenObj)) {
      safeRedirect('/home', ctx)
    }
  }
}

export const tokenObjValid = (token: TokenModel): boolean => {
  try {
    if (token) {
      const date: number = token.exp
      return date >= Date.now() / 1000
    }
  } catch (e) {
    return false
  }
  return false
}

export const auth = (ctx: NextPageContext, roles?: Roles[]) => {
  const { token } = nextCookie(ctx)

  // If there's no token, it means the user is not logged in.
  if (!token) {
    safeRedirect('/login', ctx)
  } else {
    const tokenObj: TokenModel = jwtDecode(token)
    // If token is expired
    if (!tokenObjValid(tokenObj)) {
      safeRedirect('/login', ctx)
    }
    // If roles is suplied check if user have access, if not go back to safety
    blockWithRoles(roles, tokenObj, ctx)
  }

  return token
}

export const redirect = (ctx: NextPageContext) => {
  const { token } = nextCookie(ctx)
  if (token !== undefined && tokenValid(token)) {
    safeRedirect('/home', ctx)
  }
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
    return -1
  }
}

export const getRoles = (): string[] => {
  try {
    const token: TokenModel = jwtDecode(getToken())
    return token.role
  } catch (e) {
    return []
  }
}

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
    return false
  }
  return false
}

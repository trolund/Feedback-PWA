/* eslint-disable consistent-return */
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

export const getCompanyId = (): number => {
  const token: TokenModel = jwtDecode(cookie.get(TOKENKEY))
  return token.CID
}

export const tokenValid = (token: string) => {
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

export const getRoles = (): string[] => {
  const token: TokenModel = jwtDecode(getToken())
  return token.role
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

// export const tokenValid = (token: string) => {
//   try {
//     const obj: any = jwtDecode(token)
//     if (obj) {
//       const date: number = obj.exp
//       return date >= Date.now() / 1000
//     }
//   } catch (e) {
//     console.error(e)
//   }
//   return false
// }

// const AuthService = {
//   auth: (ctx): string => {
//     const { token } = nextCookie(ctx)

//     if (ctx.req && !token) {
//       ctx.res.writeHead(302, { Location: '/login' })
//       ctx.res.end()
//       return
//     }

//     if (!token) {
//       Router.push('/login')
//     }

//     return token
//   },

//   getToken: (ctx?): string => {
//     try {
//       const { token } = nextCookie(ctx)
//       if (token) {
//         return token
//       }
//       if (ctx.req && !token) {
//         ctx.res.writeHead(302, { Location: '/login' })
//         ctx.res.end()
//         return null
//       }

//       if (!token) {
//         Router.push('/login')
//       }
//       return null
//     } catch (e) {
//       console.log(e)
//     }
//     // Router.push('/login')
//     return null
//   },

//   getCompanyId: (ctx?): number => {
//     const token: TokenModel = this?.parseJwt(this.getToken())
//     console.log('CID:', token.CID)
//     return token.CID
//   },

//   redirectToLogin: (ctx?) => {
//     const { token } = nextCookie(ctx)
//     if (!this.isServer) {
//       try {
//         const obj: any = jwtDecode(token)
//         if (obj) {
//           const date: number = obj.exp
//           if (date <= Date.now() / 1000) {
//             if (ctx.req) {
//               ctx.res.writeHead(302, { Location: '/login' })
//               ctx.res.end()
//             } else {
//               Router.push('/login')
//             }
//           }
//         }
//       } catch (e) {
//         console.log(e)
//       }
//     }
//   }
// }

// class AuthService {
//   isServer = () => typeof window === 'undefined'

//   // getToken = (): string => {
//   //   try {
//   //     const token = cookies.get('jwttoken')
//   //     if (token) {
//   //       return token
//   //     }
//   //     // Router.push('/login') // TODO
//   //     return null
//   //   } catch (e) {
//   //     console.log(e)
//   //   }
//   //   // Router.push('/login')
//   //   return null
//   // }

//   logout = () => {
//     try {
//       localStorage.setItem('token', null)
//       // Router.push('/')
//     } catch (e) {
//       console.error(e)
//     }
//   }

//   parseJwt = (token: string) => {
//     const base64Url = token.split('.')[1]
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split('')
//         .map(c => {
//           return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`
//         })
//         .join('')
//     )
//     return JSON.parse(jsonPayload)
//   }

//   redirectToLogin = () => {
//     if (!this.isServer) {
//       try {
//         const obj: any = jwtDecode(localStorage.getItem('token'))
//         if (obj) {
//           const date: number = obj.exp
//           // if (date <= Date.now() / 1000) Router.push('/login')
//         }
//       } catch (e) {
//         console.log(e)
//       }
//     }
//   }

//   redirectToHome = () => {
//     if (!this.isServer()) {
//       try {
//         const obj: any = jwtDecode(localStorage.getItem('token'))
//         if (obj) {
//           const date: number = obj.exp
//           // if (date >= Date.now() / 1000) Router.push('/home')
//         }
//       } catch (e) {
//         console.log(e)
//       }
//     }
//   }

//   tokenValid = (token: string) => {
//     try {
//       const obj: any = jwtDecode(token)
//       if (obj) {
//         const date: number = obj.exp
//         return date >= Date.now() / 1000
//       }
//     } catch (e) {
//       console.error(e)
//     }
//     return false
//   }

//   savedTokenValid = () => {
//     try {
//       const obj: any = jwtDecode(this.getToken())
//       if (obj) {
//         const date: number = obj.exp
//         return date >= Date.now() / 1000
//       }
//     } catch (e) {
//       console.error(e)
//     }
//     return false
//   }

//   // tokenValid = (): boolean => {
//   //   if (!this.isServer) {
//   //     try {
//   //       const obj: any = jwtDecode(localStorage.getItem('token'))
//   //       if (obj) {
//   //         const date: number = obj.exp
//   //         return date >= Date.now() / 1000
//   //       }
//   //       return false
//   //     } catch (e) {
//   //       console.log(e)
//   //     }
//   //   }
//   //   return null
//   // }

//   getRoles = (): string[] => {
//     const token: TokenModel = this?.parseJwt(this.getToken())
//     return token.role
//   }

//   // isAdmin = (): boolean => {
//   //   const token: TokenModel = this?.parseJwt(this.getToken())
//   //   return token.role.includes('Admin')
//   // }

//   // isVAdmin = (): boolean => {
//   //   const token: TokenModel = this?.parseJwt(this.getToken())
//   //   return token.role.includes('VAdmin')
//   // }

//   // isFacilitator = (): boolean => {
//   //   const token: TokenModel = this?.parseJwt(this.getToken())
//   //   return token.role.includes('Facilitator')
//   // }

//   getUserId = (): string => {
//     const token: TokenModel = this?.parseJwt(this.getToken())
//     return token.sub
//   }

//   getExp = (): number => {
//     const token: TokenModel = this?.parseJwt(this.getToken())
//     console.log('exp:', token.exp)
//     return token.exp
//   }

//   getCompanyId = (): number => {
//     const token: TokenModel = this?.parseJwt(this.getToken())
//     console.log('CID:', token.CID)
//     return token.CID
//   }

//   getCompanyIdWithToken = (inputtoken: string): number => {
//     const token: TokenModel = this?.parseJwt(inputtoken)
//     return token.CID
//   }

//   getTokenModel = (): TokenModel => {
//     const token: TokenModel = this?.parseJwt(this.getToken())
//     return token
//   }
// }

// const authService = new AuthService()

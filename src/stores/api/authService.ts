import TokenModel from '../../models/TokenModel'

const AuthService = {
  getToken: () => {
    const token = localStorage.getItem('token')
    console.log('Token: ', token)
    return token
  },

  getRoles: (): string[] => {
    const token: TokenModel = this.parseJwt(this.getToken())
    return token.role
  },

  getUserId: (): string => {
    const token: TokenModel = this.parseJwt(this.getToken())
    return token.sub
  },

  getExp(): number {
    const token: TokenModel = this.parseJwt(this.getToken())
    return token.exp
  },

  getTokenModel(): TokenModel {
    const token: TokenModel = this.parseJwt(this.getToken())
    return token
  },

  parseJwt: (token: string) => {
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
}

export default AuthService

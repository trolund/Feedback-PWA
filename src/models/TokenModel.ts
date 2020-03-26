export default interface TokenModel {
  nbf: number
  exp: number
  iss: string
  aud: string
  sub: string
  idp: string
  AspNet: { Identity: { SecurityStamp: string } }
  role: string[]
  name: string
  email: string
  UserId: string
  scope: string[]
  amr: string[]
  CID: number
}

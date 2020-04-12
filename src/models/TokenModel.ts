export default interface TokenModel {
  sub: string
  CID: number
  uniqueName: string
  role: string[]
  nbf: number
  exp: number
  iat: number
}

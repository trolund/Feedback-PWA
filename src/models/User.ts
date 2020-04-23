export default interface IUser {
  id?: string
  companyId?: number
  email?: string
  companyName?: string
  firstname?: string
  lastname?: string
  companyConfirmed?: string
  phoneNumber?: string
  roles?: string[]
  token?: string
}

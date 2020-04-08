export default interface UserAdmin {
  userId: string
  companyId: number
  companyConfirmed: boolean
  firstname: string
  lastname: string
  phoneNumber: string
  email: string
  delete: boolean

  modifyed?: boolean
}

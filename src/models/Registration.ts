import Company from './Company'

export default interface Registration {
  companyId?: number
  firstname: string
  lastname: string
  requesetedRoles: string[]
  email: string
  password: string
  passwordAgain: string
  company?: Company
  phone: string
}

import { persist } from 'mobx-persist'
import IUser from '../User'

export default class User implements IUser {
  @persist id?: string

  @persist companyId?: number

  @persist email?: string

  @persist companyName?: string

  @persist firstname?: string

  @persist lastname?: string

  @persist companyConfirmed?: boolean

  @persist phoneNumber?: string

  @persist('list') roles?: string[]

  @persist token?: string
}

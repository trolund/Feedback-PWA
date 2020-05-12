import { persist } from 'mobx-persist'
import { observable } from 'mobx'
import IUser from '../User'

export default class User implements IUser {
  @persist @observable id?: string

  @persist @observable companyId?: number

  @persist @observable email?: string

  @persist @observable companyName?: string

  @persist @observable firstname?: string

  @persist @observable lastname?: string

  @persist @observable companyConfirmed?: boolean

  @persist @observable phoneNumber?: string

  @persist('list') @observable roles?: string[]

  @persist @observable token?: string
}

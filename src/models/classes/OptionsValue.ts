import { persist } from 'mobx-persist'
import { observable } from 'mobx'
import IOptionsValue from '../OptionsValue'

export default class OptionsValue implements IOptionsValue {
  @persist @observable label: string

  @persist @observable value: string
}

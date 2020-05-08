import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'
import FetchStates from './requestState'

declare global {
  interface Window {
    isDark: boolean
  }
}

export default class SettingsStore {
  // status
  @observable state = FetchStates.DONE

  @observable msg = ''

  // data
  @persist @observable realtimeFeedbackDefault: boolean = false

  @persist @observable isLight: boolean = false

  @persist @observable showTitleInBottomNav: boolean = false

  @action setRealtimeFeedbackDefault = (value: boolean) => {
    this.realtimeFeedbackDefault = value
  }

  @action setShowTitleInBottomNav = (value: boolean) => {
    this.showTitleInBottomNav = value
  }
}

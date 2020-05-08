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

  @action setShowTitleInBottomNav = (value: boolean) => {
    this.showTitleInBottomNav = value
  }

  @action toggleLightMode = () => {
    if (!this.isLight) {
      try {
        this.isLight = !this.isLight
        document.querySelector('html').classList.add('light')
        window.isDark = true
      } catch (err) {
        // todo
      }
    } else {
      try {
        this.isLight = !this.isLight
        document.querySelector('html').classList.remove('light')
        window.isDark = false
      } catch (err) {
        // todo
      }
    }
  }
}

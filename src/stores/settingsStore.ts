import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'
import FetchStates from './requestState'

declare global {
  interface Window {
    isLight: boolean
  }
}

export default class SettingsStore {
  // status
  @observable state = FetchStates.DONE

  @observable msg = ''

  // data
  @persist @observable realtimeFeedbackDefault: boolean = false

  @persist @observable isLight: boolean = false

  @action toggleLightMode = () => {
    if (!this.isLight) {
      try {
        this.isLight = !this.isLight
        document.querySelector('html').classList.add('light')
        window.isLight = true
      } catch (err) {
        // todo
      }
    } else {
      try {
        this.isLight = !this.isLight
        document.querySelector('html').classList.remove('light')
        window.isLight = false
      } catch (err) {
        // todo
      }
    }
  }
}

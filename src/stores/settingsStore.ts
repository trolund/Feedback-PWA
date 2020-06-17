import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'
import FetchStates from './requestState'
import { logEvent } from '../utils/analytics'
import IStoreFetchState from './StoreFetchState'

export default class SettingsStore implements IStoreFetchState {
  // status
  @observable fetchState = FetchStates.DONE

  @observable msg = ''

  // data
  @persist @observable realtimeFeedbackDefault: boolean = false

  @persist @observable isLight: boolean = false

  @persist @observable showTitleInBottomNav: boolean = false

  @persist @observable showDefQuestionSets: boolean = false

  @persist @observable hideTempQuestionSets: boolean = false

  @persist @observable animation: boolean = false

  @persist @observable bottombarVisable: boolean = false

  @action clear = () => {
    // do not clear the settings!
  }

  @action setBottombarVisable = (value: boolean) => {
    this.bottombarVisable = value
  }

  @action getShowTitleInBottomNav = () => this.showTitleInBottomNav

  @action setAnimation = (value: boolean) => {
    this.animation = value
    if (value) {
      logEvent('animation', 'disabled')
    } else {
      logEvent('animation', 'enabled')
    }
  }

  @action setHideTempQuestionSets = (value: boolean) => {
    this.hideTempQuestionSets = value
    if (value) {
      logEvent('hide templete sets', 'enabled')
    } else {
      logEvent('hide templete sets', 'disabled')
    }
  }

  @action setRealtimeFeedbackDefault = (value: boolean) => {
    this.realtimeFeedbackDefault = value
    if (value) {
      logEvent('realtime feedback default', 'enabled')
    } else {
      logEvent('realtime feedback default', 'disabled')
    }
  }

  @action setShowDefQuestionSets = (value: boolean) => {
    this.showDefQuestionSets = value
    if (value) {
      logEvent('Hide templete Question sets', 'enabled')
    } else {
      logEvent('realtime feedback default', 'disabled')
    }
  }

  @action setShowTitleInBottomNav = (value: boolean) => {
    this.showTitleInBottomNav = value
    if (value) {
      logEvent('title in bottom Navigation', 'enabled')
    } else {
      logEvent('title in bottom Navigation', 'disabled')
    }
  }
}

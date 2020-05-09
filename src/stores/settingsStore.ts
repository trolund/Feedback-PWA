import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'
import FetchStates from './requestState'

export default class SettingsStore {
  // status
  @observable state = FetchStates.DONE

  @observable msg = ''

  // data
  @persist @observable realtimeFeedbackDefault: boolean = false

  @persist @observable isLight: boolean = false

  @persist @observable showTitleInBottomNav: boolean = false

  @persist @observable showDefQuestionSets: boolean = false

  @persist @observable hideTempQuestionSets: boolean = false

  @action setHideTempQuestionSets = (value: boolean) => {
    this.hideTempQuestionSets = value
  }

  @action setRealtimeFeedbackDefault = (value: boolean) => {
    this.realtimeFeedbackDefault = value
  }

  @action setShowDefQuestionSets = (value: boolean) => {
    this.showDefQuestionSets = value
  }

  @action setShowTitleInBottomNav = (value: boolean) => {
    this.showTitleInBottomNav = value
  }
}

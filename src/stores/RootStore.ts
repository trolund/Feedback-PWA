import { createContext } from 'react'
import { create } from 'mobx-persist'
import DashboardStore from './dashboard-store'
import AuthStore from './authStore'
import CategoriesStore from './CategoriesStore'
import FeedbackStore from './FeedbackStore'
import MeetingStore from './MeetingStore'
import QuestionSetStore from './QuestionSetStore'
import QuestionStore from './QuestionStore'
import UserAdminStore from './userAdminStore'
import SettingsStore from './settingsStore'

const isServer = typeof window === 'undefined'

const doHydration = (root: RootStore) => {
  // only hydrate on the client side
  if (!isServer) {
    const hydrate = create({
      storage: localStorage,
      jsonify: true
    })
    // hydrate all presistent stores
    hydrate('dashboardStore', root.dashboardStore)
    hydrate('authStore', root.authStore)
    hydrate('settingsStore', root.settingStore)
    // hydrate('categoriesStore', root.categoriesStore)
    // hydrate('feedbackStore', root.feedbackStore)
    // hydrate('meetingStore', root.meetingStore)
    // hydrate('questionSetStore', root.questionSetStore)
    // hydrate('questionStore', root.questionStore)
    // hydrate('userAdminStore', root.userAdminStore)
  }
}

export class RootStore {
  // all the stores
  authStore = new AuthStore()

  dashboardStore = new DashboardStore()

  categoriesStore = new CategoriesStore()

  feedbackStore = new FeedbackStore()

  meetingStore = new MeetingStore()

  questionSetStore = new QuestionSetStore()

  questionStore = new QuestionStore()

  userAdminStore = new UserAdminStore()

  settingStore = new SettingsStore()

  constructor() {
    doHydration(this)
  }
}

const rootStore = createContext(new RootStore())

export default rootStore

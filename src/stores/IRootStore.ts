import AuthStore from './authStore'
import DashboardStore from './dashboard-store'
import CategoriesStore from './CategoriesStore'
import FeedbackStore from './FeedbackStore'
import MeetingStore from './MeetingStore'
import QuestionSetStore from './QuestionSetStore'
import QuestionStore from './QuestionStore'
import UserAdminStore from './userAdminStore'
import SettingsStore from './settingsStore'

export default interface IRootStore {
  authStore: AuthStore
  dashboardStore: DashboardStore
  categoriesStore: CategoriesStore
  feedbackStore: FeedbackStore
  meetingStore: MeetingStore
  questionSetStore: QuestionSetStore
  questionStore: QuestionStore
  userAdminStore: UserAdminStore
  settingStore: SettingsStore
}

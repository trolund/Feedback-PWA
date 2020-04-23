// const { apiUrl } = process.env.apiUrl

// const isServer = () => typeof window === 'undefined'
const apiUrl = () => {
  // if (!isServer) return process.env.API_URL
  return process.env.apiUrl
}

const appendCategoriesParms = (inputStr: string, categories: string[]) => {
  let returnStr = inputStr
  const categoriesStr = categories.map(item => `&categories=${item}`)
  returnStr += categoriesStr

  return returnStr
}

const ApiRoutes = {
  requestPasswordReset: `${apiUrl()}/Api/User/requestPasswordReset`,
  confirmPasswordReset: `${apiUrl()}/Api/User/confirmPasswordReset`,
  signout: `${apiUrl()}/Api/User/signout`,
  updateUserAdmin: `${apiUrl()}/Api/User/userAdmin`,
  updateQuestionSet: `${apiUrl()}/Api/QuestionSet`,
  createQuestionSet: `${apiUrl()}/Api/QuestionSet`,
  createMeeting: `${apiUrl()}/Api/Meeting/Create`,
  updateMeeting: `${apiUrl()}/Api/Meeting`,
  deleteMeeting: `${apiUrl()}/Api/Meeting/Delete`,
  meetingsByDay: (day: Date) =>
    `${apiUrl()}/Api/Meeting/ByDay/${day.toISOString()}`,
  createUser: `${apiUrl()}/Api/User/Post`,
  updateUserPassword: `${apiUrl()}/Api/User/newPassword`,
  updateUserInfo: `${apiUrl()}/Api/User/userUpdate`,
  qrcode: (mid: string) => `/feedback/${String(mid)}`,
  meetingByShortId: (id: string) => `${apiUrl()}/Api/Meeting/ShortId/${id}`,
  login: `${apiUrl()}/Api/User/authenticate`,
  CreateFeedbackBatch: () => `${apiUrl()}/Api/FeedbackBatch`,
  FetchQuestions: (meetingId: string) =>
    `${apiUrl()}/Api/Meeting/MeetingOpen/${meetingId}`,
  isMeetingOpen: (meetingId: string) =>
    `${apiUrl()}/Api/Meeting/IsMeetingOpen/${meetingId}`,
  QuestionSetNames: `${apiUrl()}/Api/QuestionSet/SetOnly`,
  QuestionSetById: (id: string) => `${apiUrl()}/Api/QuestionSet/${id}`,
  Feedbackbatch: (id: string) => `${apiUrl()}/Api/FeedbackBatch/${id}`,
  userRating: `${apiUrl()}/Api/FeedbackBatch/rating`,
  Categories: (companyId: string) =>
    `${apiUrl()}/Api/Meeting/Categories/${companyId}`,
  MeetingsByDates: (start: Date, end: Date) =>
    `${apiUrl()}/Api/Meeting/ByDate?start=${start.toISOString()}&end=${end.toISOString()}`,
  Dashboard: (
    start: Date,
    end: Date,
    categories?: string[],
    searchWord?: string
  ) => {
    let returnStr = `${apiUrl()}/Api/FeedbackBatch/dashboard?start=${start.toISOString()}&end=${end.toISOString()}`

    if (categories) {
      returnStr = appendCategoriesParms(returnStr, categories)
    }

    if (searchWord) {
      returnStr += `&searchWord=${searchWord}`
    }

    return returnStr
  },
  DashboardMonth: (
    start: Date,
    end: Date,
    categories?: string[],
    searchWord?: string,
    onlyOwnData: boolean = true
  ) => {
    let returnStr = `${apiUrl()}/Api/FeedbackBatch/dashboardMonth?start=${start.toISOString()}&end=${end.toISOString()}&onlyOwnData=${onlyOwnData}`
    if (searchWord) {
      returnStr += `&searchWord=${searchWord}`
    }
    if (categories) {
      returnStr = appendCategoriesParms(returnStr, categories)
    }

    return returnStr
  },
  DashboardDate: (
    start: Date,
    end: Date,
    categories?: string[],
    searchWord?: string,
    onlyOwnData: boolean = true
  ) => {
    let returnStr = `${apiUrl()}/Api/FeedbackBatch/dashboardDate?start=${start.toISOString()}&end=${end.toISOString()}&onlyOwnData=${onlyOwnData}`
    if (searchWord) {
      returnStr += `&searchWord=${searchWord}`
    }
    if (categories) {
      console.log(categories)

      returnStr = appendCategoriesParms(returnStr, categories)
    }

    return returnStr
  }
}

export default ApiRoutes

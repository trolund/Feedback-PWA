const appendCategoriesParms = (inputStr: string, categories: string[]) => {
  let returnStr = inputStr
  const categoriesStr = categories.map(item => `&categories=${item}`)
  returnStr += categoriesStr

  return returnStr
}

const { apiUrl } = process.env

const ApiRoutes = {
  qrcode: (mid: string) => `${apiUrl}/Api/Meeting/QrCode/${String(mid)}`,
  meetingByShortId: (id: string) => `${apiUrl}/Api/Meeting/ShortId/${id}`,
  login: `${apiUrl}/Api/User/authenticate`,
  CreateFeedbackBatch: () => `${apiUrl}/Api/FeedbackBatch`,
  FetchQuestions: (meetingId: string) =>
    `${apiUrl}/Api/Meeting/MeetingOpen/${meetingId}`,
  QuestionSetNames: `${apiUrl}/Api/QuestionSet/SetOnly`,
  QuestionSetById: (id: string) => `${apiUrl}/Api/QuestionSet/${id}`,
  Feedbackbatch: (id: string) => `${apiUrl}/Api/FeedbackBatch/${id}`,
  Categories: (companyId: string) =>
    `${apiUrl}/Api/Meeting/Categories/${companyId}`,
  MeetingsByDates: (start: Date, end: Date) =>
    `${apiUrl}/Api/Meeting/ByDate?start=${start.toISOString()}&end=${end.toISOString()}`,
  Dashboard: (
    start: Date,
    end: Date,
    categories?: string[],
    searchWord?: string
  ) => {
    let returnStr = `${apiUrl}/Api/FeedbackBatch/dashboard?start=${start.toISOString()}&end=${end.toISOString()}`

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
    let returnStr = `${apiUrl}/Api/FeedbackBatch/dashboardMonth?start=${start.toISOString()}&end=${end.toISOString()}&onlyOwnData=${onlyOwnData}`
    if (searchWord) {
      returnStr += `&searchWord=${searchWord}`
    }
    if (categories) {
      returnStr = appendCategoriesParms(returnStr, categories)
    }

    return returnStr
  }
}

export default ApiRoutes

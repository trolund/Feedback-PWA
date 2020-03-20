const Routes = {
  QuestionSetNames: "Api/QuestionSet/SetOnly",
  QuestionSetById: (id: string) => `/Api/QuestionSet/${id}`,
  Feedbackbatch: (id: string) => `/Api​/FeedbackBatch​/${id}`,
  Categories: (companyId: string) => `/Api/Meeting/Categories/${companyId}`,
  MeetingsByDates: (start: Date, end: Date) =>
    `Api/Meeting/ByDate?start=${start.toISOString()}&end=${end.toISOString()}`,
  Dashboard: (
    start: Date,
    end: Date,
    categories?: string[],
    searchWord?: string
  ) => {
    var returnStr = `Api/FeedbackBatch/dashboard?start=${start.toISOString()}&end=${end.toISOString()}`;

    if (categories) {
      returnStr = appendCategoriesParms(returnStr, categories);
    }

    if (searchWord) {
      returnStr = returnStr + `&searchWord=${searchWord}`;
    }

    return returnStr;
  },
  DashboardMonth: (
    start: Date,
    end: Date,
    categories?: string[],
    searchWord?: string,
    onlyOwnData: boolean = true
  ) => {
    var returnStr = `Api/FeedbackBatch/dashboardMonth?start=${start.toISOString()}&end=${end.toISOString()}&onlyOwnData=${onlyOwnData}`;
    if (searchWord) {
      returnStr = returnStr + `&searchWord=${searchWord}`;
    }
    if (categories) {
      returnStr = appendCategoriesParms(returnStr, categories);
    }

    return returnStr;
  }
};

const appendCategoriesParms = (returnStr: string, categories: string[]) => {
  const categoriesStr = categories.map(item => `&categories=${item}`);
  returnStr = returnStr + categoriesStr;

  return returnStr;
};

export default Routes;

/* eslint-disable no-continue */
import FeedbackDate from '../models/FeedbackDate'
import GraphData from '../models/GraphData'
import GraphXScale from '../models/GraphXScale'

class CalculationService {
  monthNames = [
    'jan',
    'feb',
    'marts',
    'april',
    'may',
    'juni',
    'juli',
    'aug',
    'sep',
    'okt',
    'nov',
    'dec'
  ]

  onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index
  }

  getWeekNumber = (input: Date) => {
    const d = new Date(input)
    // Copy date so don't modify original
    d.setHours(0, 0, 0)
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7))
    // Get first day of year
    const yearStart = new Date(d.getFullYear(), 0, 1)
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    )
    // Return array of year and week number
    return weekNo
  }

  weeksInYear = (year: number) => {
    const month = 11
    let day = 31
    let week: number

    // Find week that 31 Dec is in. If is first week, reduce date until
    // get previous week.
    do {
      const d: Date = new Date(year, month, day--)
      week = this.getWeekNumber(d)
    } while (week === 1)

    return week
  }

  calGraphData = (
    data: FeedbackDate[],
    cutofGraphEnds: boolean = true,
    Xscale: GraphXScale,
    skipZeroValues: boolean
  ): GraphData => {
    // hvis der ikke er noget data send Tom dummy data.
    if (!data) {
      return {
        labels: this.monthNames,
        dataPoints: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        numberOfProcessedItems: 0,
        numberOfBatches: [...new Set(data?.map(f => f.feedbackBatchId))].length
      } as GraphData
    }

    const tempData: number[] = []
    const tempLabels: string[] = []

    const allYears: number[] = data.map(item =>
      new Date(item.date).getFullYear()
    )
    const uniqueYears = allYears.filter(this.onlyUnique).sort()

    uniqueYears.forEach(year => {
      if (Xscale === GraphXScale.mounths) {
        for (let month: number = 0; month <= 11; ++month) {
          const values = data.filter(
            item =>
              new Date(item.date).getMonth() === month &&
              new Date(item.date).getFullYear() === year
          )

          const num =
            values.reduce((sum, item) => sum + item.answer, 0) /
            (values.length + 1)

          if (skipZeroValues && num === 0) {
            continue
          }

          tempData.push(num)
          tempLabels.push(`${this.monthNames[month]} ${year}`)
        }
      } else if (Xscale === GraphXScale.weeks) {
        const weeks = this.weeksInYear(year) - 1
        for (let week: number = 1; week <= weeks; ++week) {
          const values = data.filter(
            item =>
              this.getWeekNumber(item.date) === week &&
              new Date(item.date).getFullYear() === year
          )

          const num =
            values.reduce((sum, item) => sum + item.answer, 0) /
            (values.length + 1)

          if (skipZeroValues && num === 0) {
            continue
          }

          tempData.push(num)
          tempLabels.push(`${week} ${year}`)
        }
      }
    })

    if (cutofGraphEnds) {
      const startCutIndex: number = tempData.findIndex(item => item > 0)
      const endCutIndex: number = tempData.reverse().findIndex(item => item > 0)
      const dataPoints = tempData
        .reverse()
        .slice(startCutIndex, tempData.length - endCutIndex)

      const labels = tempLabels.slice(
        startCutIndex,
        tempLabels.length - endCutIndex
      )

      return {
        labels,
        dataPoints,
        numberOfProcessedItems: data.length,
        numberOfBatches: [...new Set(data?.map(f => f.feedbackBatchId))].length
      } as GraphData
    }

    return {
      labels: tempLabels,
      dataPoints: tempData,
      numberOfProcessedItems: data.length,
      numberOfBatches: [...new Set(data.map(f => f.feedbackBatchId))].length
    } as GraphData
  }

  questionData = (data: FeedbackDate[], questionSetId: string) => {
    const uniqueQuestions = Array.from(
      new Set<string>(
        data
          .filter(f => f.questionSetId === questionSetId)
          .map(f => f.questionId)
      ),
      i => i
    )

    const avgForQuestions = uniqueQuestions.map(q => {
      const answerOnQuestion = data.filter(f => f.questionId === q)
      return (
        answerOnQuestion.reduce((sum, item) => sum + item.answer, 0) /
        answerOnQuestion.length
      )
    })

    return {
      labels: uniqueQuestions.map((q, n) => String(n + 1)),
      dataPoints: avgForQuestions,
      numberOfProcessedItems: data.length,
      numberOfBatches: [...new Set(data?.map(f => f.feedbackBatchId))].length
    } as GraphData
  }
}

export default CalculationService

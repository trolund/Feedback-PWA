import FeedbackDate from '../models/FeedbackDate'
import GraphData from '../models/GraphData'

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

  calGraphData = (
    data: FeedbackDate[],
    cutofGraphEnds: boolean = true
  ): GraphData => {
    // hvis der ikke er noget data send Tom dummy data.
    if (!data) {
      return {
        labels: this.monthNames,
        dataPoints: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        numberOfProcessedItems: 0
      } as GraphData
    }

    const tempData: number[] = []
    const tempLabels: string[] = []
    const allYears: number[] = data.map(item =>
      new Date(item.date).getFullYear()
    )
    const uniqueYears = allYears.filter(this.onlyUnique).sort()

    uniqueYears.forEach(year => {
      for (let month: number = 0; month <= 11; ++month) {
        const values = data.filter(
          item =>
            new Date(item.date).getMonth() === month &&
            new Date(item.date).getFullYear() === year
        )

        const num =
          values.reduce((sum, item) => sum + item.answer, 0) /
          (values.length + 1)

        tempData.push(num)
        tempLabels.push(`${this.monthNames[month]} ${year}`)
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

      //   console.log('labels: ', labels)
      //   console.log('datapoints: ', dataPoints)

      return {
        labels,
        dataPoints,
        numberOfProcessedItems: data.length
      } as GraphData
    }
    return {
      labels: tempLabels,
      dataPoints: tempData,
      numberOfProcessedItems: data.length
    } as GraphData
  }
}

export default CalculationService

import React, { useCallback } from 'react'
import { Line } from 'react-chartjs-2'
import FetchStates from '../stores/requestState'
// import FeedbackDate from '../models/FeedbackDate'
import GraphData from '../models/GraphData'

interface LineGraphProps {
  data: GraphData | null
  fetchState: FetchStates
  useFixedXAxis: boolean
}

const LineGraph: React.FC<LineGraphProps> = (props: LineGraphProps) => {
  // const [labels, setLabels] = useState([
  //   'jan',
  //   'feb',
  //   'marts',
  //   'april',
  //   'may',
  //   'juni',
  //   'juli',
  //   'aug',
  //   'sep',
  //   'okt',
  //   'nov',
  //   'dec'
  // ])
  // const [avgData, setAvgData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

  const { data, useFixedXAxis } = props

  const height = 300

  // const monthNames = [
  //   'jan',
  //   'feb',
  //   'marts',
  //   'april',
  //   'may',
  //   'juni',
  //   'juli',
  //   'aug',
  //   'sep',
  //   'okt',
  //   'nov',
  //   'dec'
  // ]

  // const avgData = useCallback(() => {
  //   if (data) {
  //     const returnData: number[] = []
  //     for (let month: number = 1; month <= 12; month++) {
  //       const num =
  //         data
  //           .filter(item => item.date.getMonth() === month)
  //           .reduce((sum, item) => sum + item.answer, 0) / data.length
  //       returnData.push(num)
  //     }
  //     return returnData
  //   }
  //   return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  // }, [data])

  // function onlyUnique(value, index, self) {
  //   return self.indexOf(value) === index
  // }

  // // const sortByDate = (a: FeedbackDate, b: FeedbackDate) => {
  // //   const adate = a.date
  // //   const bdate = b.date
  // //   // eslint-disable-next-line no-nested-ternary
  // //   return adate > bdate ? -1 : adate < bdate ? 1 : 0
  // // }

  // const graphDataArray = useCallback(() => {
  //   if (data) {
  //     const tempData: number[] = []
  //     const tempLabels: string[] = []

  //     // const sortetData = data.sort(sortByDate)
  //     // console.log(sortetData)

  //     // sortetData.forEach(item => {
  //     //   const newYear = !years.includes(new Date(item.date).getFullYear())
  //     //   if (newYear) years.push(new Date(item.date).getFullYear())
  //     //   return newYear
  //     // })

  //     const allYears: number[] = data.map(item =>
  //       new Date(item.date).getFullYear()
  //     )

  //     // const allMonths: string[] = data.map(
  //     //   item => monthNames[item.date.getMonth() - 1]
  //     // )
  //     const uniqueYears = allYears.filter(onlyUnique).sort()
  //     // const uniqueMonths = allYears.filter(onlyUnique)

  //     // const monthArray: number[] = []
  //     // sortetData.forEach(item => {
  //     //   const newYear = !monthArray.includes(new Date(item.date).getMonth())
  //     //   if (newYear) monthArray.push(new Date(item.date).getMonth())
  //     //   return newYear
  //     // })

  //     uniqueYears.forEach(year => {
  //       for (let month: number = 0; month <= 11; ++month) {
  //         const values = data.filter(
  //           item =>
  //             new Date(item.date).getMonth() === month &&
  //             new Date(item.date).getFullYear() === year
  //         )

  //         const num =
  //           values.reduce((sum, item) => sum + item.answer, 0) /
  //           (values.length + 1)

  //         tempData.push(num)
  //         tempLabels.push(`${monthNames[month]} ${year}`)
  //       }
  //     })

  //     const startCutIndex: number = tempData.findIndex(item => item > 0)
  //     const endCutIndex: number = tempData.reverse().findIndex(item => item > 0)

  //     const dataPoints = tempData
  //       .reverse()
  //       .slice(startCutIndex, tempData.length - endCutIndex)

  //     const labels = tempLabels.slice(
  //       startCutIndex,
  //       tempLabels.length - endCutIndex
  //     )

  //     console.log('labels: ', labels)
  //     console.log('datapoints: ', dataPoints)

  //     return { labels, dataPoints }
  //   }
  //   return [monthNames, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
  // }, [data, monthNames])

  // const newData = () => {
  //   if (data) {

  //   }
  //   return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  // }

  // const arrAvg = data.reduce((sum,item) => sum + item.answer, 0) / data.length

  const graphData = useCallback(
    (canvas: any) => {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, 'rgb(23, 161, 129, 1)')
      gradient.addColorStop(1, 'rgb(23, 161, 129, 0.2)')
      const { labels, dataPoints } = data
      return {
        labels,
        datasets: [
          {
            label: 'Progress',
            backgroundColor: gradient, // Put the gradient here as a fill color
            borderColor: 'rgb(5, 107, 83)',
            borderWidth: 2,
            pointColor: '#fff',
            pointStrokeColor: 'rgb(5, 107, 83)',
            pointHighlightFill: '#fff',
            pointHighlightStroke: '#ff6c23',
            data: dataPoints
          }
        ]
      }
    },
    [data]
  )

  const graphOptions = useCallback(() => {
    const { dataPoints } = data

    const autoScaleOptions = {
      scales: {
        yAxes: [
          {
            ticks: {
              max: Math.max(...dataPoints),
              min: Math.min(...dataPoints)
            }
          }
        ]
      }
    }

    const fixedScaleOptions = {
      scales: {
        yAxes: [
          {
            ticks: {
              max: 3,
              min: 0
            }
          }
        ]
      }
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      datasetStrokeWidth: 3,
      pointDotStrokeWidth: 4,
      scaleLabel: "<%= Number(value).toFixed(0).replace('.', ',') + '°C'%>",
      legend: {
        display: false
      }
    }

    return useFixedXAxis
      ? { ...options, ...fixedScaleOptions }
      : { ...options, ...autoScaleOptions }
  }, [data, useFixedXAxis])

  return (
    <div className='line-chart'>
      <Line data={graphData} options={graphOptions()} />
      <style jsx>{`
        .line-chart {
          width: 100%;
        }
      `}</style>
    </div>
  )
}

export default LineGraph

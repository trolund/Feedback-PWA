import React, { useCallback, useState } from 'react'
import { Line } from 'react-chartjs-2'
import FeedbackMonth from '../models/FeedbackMonth'
import states from '../stores/requestState'

interface LineGraphProps {
  data: FeedbackMonth[] | null
  fetchState: states
  showAllOfY: boolean
}

const LineGraph: React.FC<LineGraphProps> = (props: LineGraphProps) => {
  const [labels, setLabels] = useState([
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
  ])
  const { data } = props

  const height = 300

  const avgData = useCallback(() => {
    if (data) {
      const returnData: number[] = []
      for (let month: number = 1; month <= 12; month++) {
        const num =
          data
            .filter(item => item.month === month)
            .reduce((sum, item) => sum + item.answer, 0) / data.length
        returnData.push(num)
      }

      //   if (!showAllOfY) {
      //     const range: number[] = [];
      //     for (var month: number = 1; month <= 12; month++) {
      //       if (returnData[month] === 0) {
      //         range.push(month);
      //       }
      //     }
      //     console.log(range);

      //     setLabels(labels.filter((a, index) => !range.includes(index + 1)));
      //     return returnData.filter((a, index) => a !== 0);
      //   }

      return returnData
    }
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }, [data])

  // const arrAvg = data.reduce((sum,item) => sum + item.answer, 0) / data.length

  const graphData = useCallback(
    (canvas: any) => {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, 'rgb(23, 161, 129, 1)')
      gradient.addColorStop(1, 'rgb(23, 161, 129, 0.2)')

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
            data: avgData()
          }
        ]
      }
    },
    [avgData, labels]
  )

  const options = {
    responsive: true,
    datasetStrokeWidth: 3,
    pointDotStrokeWidth: 4,
    scaleLabel: "<%= Number(value).toFixed(0).replace('.', ',') + '°C'%>",
    legend: {
      display: false
    }
  }

  return (
    <div className='line-chart'>
      <Line data={graphData} options={options} />
      <style jsx>{`
        .line-chart {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}

export default LineGraph

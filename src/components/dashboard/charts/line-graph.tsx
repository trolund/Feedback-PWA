import React, { useCallback } from 'react'
import { Line } from 'react-chartjs-2'
import FetchStates from '../../../stores/requestState'
import GraphData from '../../../models/GraphData'
import { chartColors } from '../../../services/colorContants'

interface LineGraphProps {
  data: GraphData | null
  fetchState: FetchStates
  useFixedXAxis: boolean
}

const LineGraph: React.FC<LineGraphProps> = (props: LineGraphProps) => {
  const { data, useFixedXAxis } = props
  const height = 300
  const graphData = useCallback(
    (canvas: any) => {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, chartColors.start)
      gradient.addColorStop(1, chartColors.end)
      const { labels, dataPoints } = data
      return {
        labels,
        datasets: [
          {
            label: 'Progress',
            backgroundColor: gradient, // Put the gradient here as a fill color
            borderColor: chartColors.border,
            borderWidth: 2,
            pointColor: '#fff',
            pointStrokeColor: chartColors.border,
            pointHighlightFill: '#fff',
            pointHighlightStroke: chartColors.hightlight,
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

import React, { useCallback } from 'react'
import { Bar } from 'react-chartjs-2'
import FetchStates from '../stores/requestState'
import GraphData from '../models/GraphData'

interface BarGraphProps {
  data: GraphData | null
  fetchState: FetchStates
  useFixedXAxis: boolean
}

const BarGraph: React.FC<BarGraphProps> = (props: BarGraphProps) => {
  const { data, useFixedXAxis } = props
  const { labels, dataPoints } = data

  const height = 300

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
            data: dataPoints
          }
        ]
      }
    },
    [dataPoints, labels]
  )

  const graphOptions = useCallback(() => {
    // const { dataPoints } = data

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
  }, [dataPoints, useFixedXAxis])

  return (
    <div className='line-chart'>
      <Bar data={graphData} options={graphOptions()} />
    </div>
  )
}

export default BarGraph

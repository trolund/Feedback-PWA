import React, { useCallback, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import states from '../stores/requestState'
import GraphData from '../models/GraphData'

interface BarGraphProps {
  data: GraphData | null
  fetchState: states
}

const BarGraph: React.FC<BarGraphProps> = (props: BarGraphProps) => {
  const { data, fetchState } = props
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
      <Bar data={graphData} options={options} />
    </div>
  )
}

export default BarGraph

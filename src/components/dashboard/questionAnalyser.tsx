import { Bar } from 'react-chartjs-2'
import { observer } from 'mobx-react'
import { useCallback, useContext, useState, useEffect } from 'react'
import rootStore from '../../stores/RootStore'
import CalculationService from '../../services/calculationService'
import FeedbackDate from '../../models/FeedbackDate'
import { filterTempletes } from '../../services/utilsService'
import GraphData from '../../models/GraphData'
import { chartColors } from '../../services/colorContants'

type Props = {
  data: FeedbackDate[]
  children?: React.ReactNode
}

const QuestionAnalyser = observer(({ data }: Props) => {
  const calculationService = new CalculationService()
  const [questionSet, setQuestionSet] = useState('')
  const {
    questionSetStore: { QSetNames, fetchQuestionSetNames },
    settingStore: { hideTempQuestionSets }
  } = useContext(rootStore)

  useEffect(() => {
    fetchQuestionSetNames()
  }, [])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false
    },
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

  const calcData = useCallback(() => {
    if (data && QSetNames) {
      return calculationService.questionData(data, questionSet)
    }
    return null
  }, [QSetNames, calculationService, data, questionSet])

  const graphData = useCallback(
    (canvas: any) => {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      const gradient = ctx.createLinearGradient(0, 0, 0, 400)
      gradient.addColorStop(0, chartColors.start)
      gradient.addColorStop(1, chartColors.end)

      const finalData = calcData()

      return {
        labels: finalData?.labels || [],
        datasets: [
          {
            label: 'Tilbagemeldinger per spørgsmål',
            backgroundColor: gradient, // Put the gradient here as a fill color
            borderColor: chartColors.border,
            borderWidth: 2,
            pointColor: '#fff',
            pointStrokeColor: chartColors.border,
            pointHighlightFill: '#fff',
            pointHighlightStroke: chartColors.hightlight,
            data: finalData?.dataPoints || []
          }
        ]
      }
    },
    [calcData]
  )
  return (
    <div className='container card'>
      <h5>Gennemsnit af feedback</h5>
      <div className='select-css'>
        <select
          name='select'
          onChange={e => {
            setQuestionSet(e.target.value)
          }}
        >
          <option>- Vælg spørgsmålssæt -</option>
          {QSetNames?.filter(
            hideTempQuestionSets ? filterTempletes : () => true
          )?.map(item => (
            <option key={item.questionSetId} value={item.questionSetId}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      {(calcData() as GraphData)?.labels.length === 0 ? (
        <div>Ingen tilbagemeldinger endnu på dette spørgsmålssæt.</div>
      ) : (
        <Bar data={graphData} options={chartOptions} />
      )}
      <style jsx>{`
        .container {
          max-height: 400px;
        }

        .container h5 {
          margin-top: 5px;
          margin-bottom: 10px;
          width: 100%;
          text-align: center;
        }

        h4 {
          color: var(--fg);
          margin-left: var(--gap-small);
          font-weight: 500;
          letter-spacing: 0.0035em;
        }
      `}</style>
    </div>
  )
})

export default QuestionAnalyser

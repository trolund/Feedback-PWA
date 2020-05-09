import { Bar } from 'react-chartjs-2'
import { observer } from 'mobx-react-lite'
import { useCallback, useContext, useState, useEffect } from 'react'
import rootStore from '../../stores/RootStore'
import CalculationService from '../../services/calculationService'
import FeedbackDate from '../../models/FeedbackDate'
import { filterTempletes } from '../../services/utilsService'
import GraphData from '../../models/GraphData'

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
    if (QSetNames.length === 0) {
      fetchQuestionSetNames()
    }
  }, [QSetNames, fetchQuestionSetNames])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false
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
      gradient.addColorStop(0, 'rgb(23, 161, 129, 1)')
      gradient.addColorStop(1, 'rgb(23, 161, 129, 0.2)')

      const finalData = calcData()

      return {
        labels: finalData?.labels || [],
        datasets: [
          {
            label: 'Tilbagemeldinger per spørgsmål',
            backgroundColor: gradient, // Put the gradient here as a fill color
            borderColor: 'rgb(5, 107, 83)',
            borderWidth: 2,
            pointColor: '#fff',
            pointStrokeColor: 'rgb(5, 107, 83)',
            pointHighlightFill: '#fff',
            pointHighlightStroke: '#ff6c23',
            data: finalData?.dataPoints || []
          }
        ]
      }
    },
    [calcData]
  )
  return (
    <div className='container'>
      <h5>Feedback fordelt på spørgsmål</h5>
      <div className='select-css'>
        <select
          name='select'
          onChange={e => {
            setQuestionSet(e.target.value)
          }}
        >
          <option>- Vælg spørgsmåls sæt -</option>
          {QSetNames?.filter(
            hideTempQuestionSets ? filterTempletes : () => true
          ).map(item => (
            <option key={item.questionSetId} value={item.questionSetId}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      {(calcData() as GraphData).labels.length === 0 ? (
        <div>Ingen Tilbagemeldinger endnu på dette spørgsmåls sæt.</div>
      ) : (
        <Bar data={graphData} options={chartOptions} />
      )}
      <style jsx>{`
        .container {
          background-color: var(--surface);
          border-radius: var(--border-radius);
          padding: var(--gap-small);
          margin-bottom: var(--gap-small);
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

import { Bar } from 'react-chartjs-2'
import { observer } from 'mobx-react-lite'
import { useCallback, useContext, useState, useEffect } from 'react'
import rootStore from '../../stores/RootStore'
import CalculationService from '../../services/calculationService'
import FeedbackDate from '../../models/FeedbackDate'

type Props = {
  data: FeedbackDate[]
  children?: React.ReactNode
}

const QuestionAnalyser = observer(({ data }: Props) => {
  const calculationService = new CalculationService()
  const [questionSet, setQuestionSet] = useState('')
  const {
    questionSetStore: { QSetNames, fetchQuestionSetNames }
  } = useContext(rootStore)

  useEffect(() => {
    if (!QSetNames) {
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
        labels: finalData.labels,
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
            data: finalData.dataPoints
          }
        ]
      }
    },
    [calcData]
  )
  return (
    <div>
      <div className='select-css'>
        <select
          name='select'
          onChange={e => {
            setQuestionSet(e.target.value)
          }}
        >
          <option>- Vælg spørgsmåls sæt -</option>
          {QSetNames?.map(item => (
            <option key={item.questionSetId} value={item.questionSetId}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <Bar data={graphData} options={chartOptions} />
    </div>
  )
})

export default QuestionAnalyser

import React, { useState, useContext, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react'
import { PieChart } from 'react-feather'
import { motion } from 'framer-motion'
import StarRatingComponent from 'react-star-rating-component'
import { Pie } from 'react-chartjs-2'
import rootStore from '../../stores/RootStore'
import { genColor } from '../../services/colorContants'

interface IProp {}

const Rating: React.FC<IProp> = observer(() => {
  const [rating, setRating] = useState(0)
  const { dashboardStore } = useContext(rootStore)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (rating === 0) {
      dashboardStore.fetchRating().then(() => {
        setRating(dashboardStore.rating)
      })
    }
  }, [dashboardStore, rating])

  const meetings = useCallback(
    () =>
      [
        ...new Set(
          dashboardStore.data
            ?.filter(i => i.categories.includes('Møder'))
            .map(f => f.feedbackBatchId)
        )
      ].length,
    [dashboardStore.data]
  )

  const classroom = useCallback(
    () =>
      [
        ...new Set(
          dashboardStore.data
            ?.filter(i => i.categories.includes('Undervisning'))
            .map(f => f.feedbackBatchId)
        )
      ].length,
    [dashboardStore.data]
  )

  const conf = useCallback(
    () =>
      [
        ...new Set(
          dashboardStore.data
            ?.filter(i => i.categories.includes('Foredrag'))
            .map(f => f.feedbackBatchId)
        )
      ].length,
    [dashboardStore.data]
  )

  const myData = {
    labels: ['Møder', 'Undervisning', 'Foredrag'],
    datasets: [
      {
        label: 'Progress',
        backgroundColor: [genColor(), genColor(), genColor()],
        hoverBackgroundColor: [genColor(), genColor(), genColor()],
        borderColor: 'rgba(25,137,111,1)',
        borderWidth: 1,
        hoverBorderColor: 'rgba(25,137,111,1)',
        data: [meetings(), classroom(), conf()]
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false
  }

  return (
    <div className='color-card'>
      <h5 className='card-header'>
        Overblik
        <div
          role='button'
          tabIndex={0}
          className='float-right noSelect'
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={() => setIsOpen(!isOpen)}
        >
          <p
            className='float-left'
            style={{
              fontSize: '0.6em',
              padding: '5px',
              marginBottom: '0px',
              color: 'white'
            }}
          >
            {isOpen ? 'Skjul' : 'Vis'}
          </p>
          <PieChart
            style={{ color: 'white' }}
            className='float-right noSelect'
          />
        </div>
      </h5>

      <div className='card-body'>
        <div
          style={{ paddingBottom: '10px', paddingRight: '30px' }}
          className='rating'
        >
          <p className='float-left' style={{ marginRight: '10px' }}>
            Personling score:{' '}
          </p>
          <StarRatingComponent
            name='rate1'
            starCount={6}
            value={rating}
            starColor='var(--accent)'
            emptyStarColor='var(--star)'

            // onStarClick={newRating => setRating(newRating)}
          />
        </div>

        <div className='flex-container'>
          <div>
            <p>Møder</p>
            <b className='Spinoffprimary-dark'>{meetings()}</b>
          </div>
          <div>
            <p>Undervisning</p>
            <b className='Spinoffprimary-dark'>{classroom()}</b>
          </div>
          <div>
            <p>Foredrag</p>
            <b className='Spinoffprimary-dark'>{conf()}</b>
          </div>
        </div>
        <div
          className='pie-container'
          style={{ maxHeight: isOpen ? '50vh' : '0px', height: 'fit-content' }}
        >
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.4,
                x: { type: 'spring', stiffness: 100 },
                default: { duration: 0.5 }
              }}
            >
              <div className='pie-box'>
                <Pie data={myData} options={options} />
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <style jsx>{`
        .pie-container {
          transition: all 0.5s ease-in-out;
        }

        .flex-container {
          display: flex;
        }

        .flex-container > div {
          text-align: center;
          color: white;
          border-radius: var(--border-radius);
          padding: var(--gap-small);
        }

        .flex-container > div p {
          font-size: 10px;
        }

        .flex-container > div b {
          font-size: 16px;
        }

        .pie-box {
          margin-top: var(--gap-small);
          text-align: center;
          background-color: var(--surface);
          border-radius: var(--border-radius);
          padding: var(--gap-small);
        }

        .rating {
          background-color: var(--surface);
          border-radius: var(--border-radius);
          padding: var(--gap-small);
          margin-bottom: var(--gap-small);
        }

        h5 {
          margin-top: 0px;
          color: white;
        }
      `}</style>
    </div>
  )
})

export default Rating

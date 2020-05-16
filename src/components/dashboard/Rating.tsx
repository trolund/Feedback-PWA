import React, { useState, useContext, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react'
import { PieChart } from 'react-feather'
import { motion } from 'framer-motion'
import StarRatingComponent from 'react-star-rating-component'
import { Pie } from 'react-chartjs-2'
import rootStore from '../../stores/RootStore'

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
        backgroundColor: [
          'rgba(25,137,111,0.5)',
          'rgba(25,137,111,1)',
          'rgba(25,137,111,0.75)'
        ],
        hoverBackgroundColor: [
          'rgb(5, 107, 83)',
          'rgb(5, 107, 83)',
          'rgb(5, 107, 83)'
        ],
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
          className='float-right'
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
          <PieChart style={{ color: 'white' }} className='float-right' />
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
          style={{ height: isOpen ? '20vh' : '0px' }}
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
          transition: height 0.5s ease-in-out;
        }

        .flex-container {
          display: flex;
        }

        .flex-container > div {
          text-align: center;
          background-color: var(--surface);
          border-radius: var(--border-radius);
          padding: var(--gap-small);
        }

        .pie-box {
          margin-top: var(--gap-small);
          margin-bottom: var(--gap-small);
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

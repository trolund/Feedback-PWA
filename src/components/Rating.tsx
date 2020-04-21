import React, { useState, useContext, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react'
import { PieChart } from 'react-feather'
import StarRatingComponent from 'react-star-rating-component'
// import { FaBeer, FaChartPie } from "react-icons/fa";
import { Pie } from 'react-chartjs-2'
import rootStore from '../stores/RootStore'

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
      dashboardStore.data?.filter(i => i.categories.includes('Møder')).length,
    [dashboardStore.data]
  )

  const classroom = useCallback(
    () =>
      dashboardStore.data?.filter(i => i.categories.includes('Undervisning'))
        .length,
    [dashboardStore.data]
  )

  const conf = useCallback(
    () =>
      dashboardStore.data?.filter(i => i.categories.includes('Foredrag'))
        .length,
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

  return (
    <div className='card' style={{ marginBottom: '10px' }}>
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
            style={{ fontSize: '0.6em', padding: '5px', marginBottom: '0px' }}
          >
            {isOpen ? 'Hide' : 'Show'}
          </p>
          <PieChart className='float-right' />
        </div>
      </h5>

      <div className='card-body'>
        <div style={{ paddingBottom: '10px', paddingRight: '30px' }}>
          <p className='float-left' style={{ marginRight: '10px' }}>
            Personling score:{' '}
          </p>
          <StarRatingComponent
            name='rate1'
            starCount={6}
            value={rating}
            starColor='#19896f'
            // onStarClick={newRating => setRating(newRating)}
          />
        </div>

        <div className='row'>
          <div className='col'>
            Møder: <b className='Spinoffprimary-dark'>{meetings()}</b>
          </div>
          <div className='col'>
            Undervisning: <b className='Spinoffprimary-dark'>{classroom()}</b>
          </div>
          <div className='col'>
            Foredrag: <b className='Spinoffprimary-dark'>{conf()}</b>
          </div>
        </div>

        {isOpen && <Pie data={myData} />}
      </div>
    </div>
  )
})

export default Rating

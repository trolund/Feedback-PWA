import React, { useState, useContext, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react'
import { PieChart } from 'react-feather'
import StarRatingComponent from 'react-star-rating-component'
// import { FaBeer, FaChartPie } from "react-icons/fa";
import { Pie } from 'react-chartjs-2'
import dashboardStore from '../stores/dashboard-store'

interface IProp {}

const Rating: React.FC<IProp> = observer(() => {
  const [rating, setRating] = useState(0)
  const context = useContext(dashboardStore)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (rating === 0) {
      context.fetchRating().then(() => {
        setRating(context.rating)
      })
    }
  }, [context, rating])

  const meetings = useCallback(
    () => context.data?.filter(i => i.categories.includes('Møder')).length,
    [context.data]
  )

  const classroom = useCallback(
    () =>
      context.data?.filter(i => i.categories.includes('Undervisning')).length,
    [context.data]
  )

  const conf = useCallback(
    () => context.data?.filter(i => i.categories.includes('Foredrag')).length,
    [context.data]
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

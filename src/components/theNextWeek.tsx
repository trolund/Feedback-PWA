import { useContext, useEffect, useState } from 'react'
import Lottie from 'react-lottie'
import { Coffee } from 'react-feather'
import Link from 'next/link'
import rootStore from '../stores/RootStore'
import MeetingModel from '../models/MeetingModel'
import * as loadingAni from '../../public/Animations/loading.json'
import MeetingStore from '../stores/MeetingStore'
import FetchStates from '../stores/requestState'

const TheNextWeek = () => {
  const { meetingStore } = useContext(rootStore)
  const [meetings, setMeetings] = useState([])

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: (loadingAni as any).default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  const days = [
    'Søndag',
    'Mandag',
    'Tirsdag',
    'Onsdag',
    'Torsdag',
    'Fredag',
    'Søndag'
  ]

  const startAndEndOfWeek = date => {
    // If no date object supplied, use current date
    // Copy date so don't modify supplied date
    const now = date ? new Date(date) : new Date()

    // set time to some convenient value
    now.setHours(0, 0, 0, 0)

    // Get the previous Monday
    const monday = new Date(now)
    monday.setDate(monday.getDate() - monday.getDay() + 1)

    // Get next Sunday
    const sunday = new Date(now)
    sunday.setDate(sunday.getDate() - sunday.getDay() + 7)

    // Return array of date objects
    return [monday, sunday]
  }

  const getWeekNumber = (d: Date) => {
    const newDate = new Date(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
    )
    newDate.setUTCDate(newDate.getUTCDate() + 4 - (newDate.getUTCDay() || 7))

    const yearStart = new Date(Date.UTC(newDate.getUTCFullYear(), 0, 1))

    const weekNo = Math.ceil(
      ((newDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    )

    return weekNo
  }

  useEffect(() => {
    const dates = startAndEndOfWeek(new Date())
    meetingStore.fetchMeetings(dates[0], dates[1]).then(() => {
      setMeetings(meetingStore.meetings)
    })
  }, [meetingStore])

  const NoMeetings = () => {
    return (
      <div className='container'>
        <Coffee />
        <p>Ingen møder i denne uge.</p>
        <style jsx>{`
          .container {
            border-radius: var(--border-radius);
            background-color: #ccc;
            padding: 20px;
            margin: auto;
            color: white;
            text-align: center;
          }
        `}</style>
      </div>
    )
  }

  const LoadingMeetings = () => {
    return (
      <div className='container'>
        <Lottie options={defaultOptions} height={45} width={45} />
        <p>Henter møder...</p>
        <style jsx>{`
          .container {
            border-radius: var(--border-radius);
            background-color: #ccc;
            padding: 1px;
            margin: auto;
            color: white;
            text-align: center;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className='container'>
      <h5>Møder i Uge {getWeekNumber(new Date())}</h5>
      <ul>
        {meetingStore.state === FetchStates.LOADING && <LoadingMeetings />}
        {meetings.length === 0 &&
          meetingStore.state !== FetchStates.LOADING && <NoMeetings />}
        {meetings.map((item: MeetingModel) => (
          <Link
            key={item.shortId}
            href='/meeting/[mid]'
            as={`/meeting/${item.shortId}`}
          >
            <li>
              <b style={{ marginRight: '10px' }}>
                {days[new Date(item.startTime).getDay()]}
              </b>
              <p>{item.name}</p>
            </li>
          </Link>
        ))}
      </ul>
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

        li {
          color: var(--fg);
          padding: var(--gap-small);
          background: var(--base);
          display: flex;
          align-items: center;
          transition: var(--transition-colors);
          border-radius: var(--border-radius);
        }

        li:not(:last-child) {
          border-bottom: 1px solid var(--divider);
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
}

export default TheNextWeek

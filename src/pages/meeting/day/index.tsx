import { useEffect, useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useDrag } from 'react-use-gesture'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'react-feather'
import Page from '../../../components/page'
import Section from '../../../components/section'
import MeetingModel from '../../../models/MeetingModel'
import rootStore from '../../../stores/RootStore'

const Day: NextPage = observer(() => {
  const router = useRouter()
  const { date } = router.query

  const [selectedDay, setSelectedDay] = useState(new Date(Number(date)))
  const [events, setEvents] = useState([] as MeetingModel[])
  const { meetingStore } = useContext(rootStore)

  const bind = useDrag(({ down, movement: [mx, my] }) => {
    console.log(mx)
  })

  const setURL = () => {
    const href = `/meeting/day?date=${selectedDay.getTime()}`
    router.push(href, href, { shallow: true })
  }

  const nextDay = () => {
    console.log('next')
    setSelectedDay(new Date(selectedDay.setDate(selectedDay.getDate() + 1)))
    setURL()
  }

  const prevDay = () => {
    console.log('prev')
    setSelectedDay(new Date(selectedDay.setDate(selectedDay.getDate() - 1)))
    setURL()
  }

  const arrowKeys = (e: any) => {
    console.log(e)

    if (e.charCode === 37) {
      nextDay()
    } else if (e.charCode === 39) {
      prevDay()
    }
  }

  useEffect(() => {
    setSelectedDay(new Date(Number(date)))
  }, [date])

  useEffect(() => {
    if (selectedDay && selectedDay.toString() !== 'Invalid Date')
      meetingStore.fetchMeetingByDay(selectedDay).then(() => {
        setEvents(meetingStore.meetings)
      })
  }, [meetingStore, selectedDay])

  return (
    <Page title='Møder' showBackButton>
      <div {...bind}>
        <div className='bar'>
          <div className='date'>
            {selectedDay.toString() !== 'Invalid Date'
              ? selectedDay.toLocaleDateString()
              : 'Henter...'}
          </div>
          <div className='float-left arrowbtn'>
            <ArrowLeft
              tabIndex={0}
              onKeyPress={e => console.log(e)}
              onClick={prevDay}
              color='white'
            />
          </div>

          <div className='float-right arrowbtn'>
            <ArrowRight
              tabIndex={0}
              onKeyPress={arrowKeys}
              onClick={nextDay}
              color='white'
            />
          </div>
        </div>
        <Section>
          <ul>
            {events?.length === 0 && <li>Ingen møder på denne dag</li>}
            {events?.map(m => (
              <li key={m.shortId}>
                <Link href='/meeting/[mid]' as={`/meeting/${m.shortId}`}>
                  <a>{m.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
        <style jsx>{`
          ul {
            margin-top: 40px;
            height: 100%;
          }
          .date {
            margin-top: 3px;
            width: 100px;
            left: 50%;
            margin-left: -50px;
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            z-index: 1;
            color: white;
          }
          .arrowbtn {
            z-index: 10;
          }
          .bar {
            margin-top: -1px;
            background-color: var(--accent);
            height: 35px;
            width: 100%;
            left: 0;
            position: absolute;
          }

          .bar div {
            padding: 5px;
          }
          .label {
            display: block;
            width: 100%;
          }
          .info {
            width: 100%;
          }
          li {
            color: var(--fg);
            padding: var(--gap-small);
            background: var(--base);
            display: flex;
            align-items: center;
            transition: var(--transition-colors);
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
    </Page>
  )
})

export default Day

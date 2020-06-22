import { useEffect, useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useDrag } from 'react-use-gesture'
import Moment from 'moment'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Coffee, Plus } from 'react-feather'
import MobileMultiSelecter from '../../../components/add-meeting'
import Page from '../../../components/essentials/page'
import Section from '../../../components/essentials/section'
import MeetingModel from '../../../models/MeetingModel'
import rootStore from '../../../stores/RootStore'
import MiddelLoader from '../../../components/essentials/middelLoading'
import FetchStates from '../../../stores/requestState'
import BottomModal from '../../../components/essentials/bottom-modal'
import { sortEventByDate } from '../../../services/sortService'
import { applyOffSet } from '../../../services/dateService'
import withAuth from '../../../components/hoc/withAuth'

const Day: NextPage = observer(() => {
  const router = useRouter()
  const { date } = router.query

  const [selectedDay, setSelectedDay] = useState(new Date(Number(date)))
  const [events, setEvents] = useState([] as MeetingModel[])
  const [showModal, setShowModal] = useState(false)
  const { meetingStore } = useContext(rootStore)

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
    //console.log(e)

    if (e.charCode === 37) {
      nextDay()
    } else if (e.charCode === 39) {
      prevDay()
    }
  }

  useEffect(() => {
    setSelectedDay(new Date(Number(date)))
  }, [date])

  const fetchMeetings = useCallback(() => {
    if (selectedDay && selectedDay.toString() !== 'Invalid Date')
      meetingStore.fetchMeetingByDay(selectedDay).then(() => {
        setEvents(meetingStore.meetings)
      })
  }, [meetingStore, selectedDay])

  useEffect(() => {
    fetchMeetings()
  }, [fetchMeetings, meetingStore.fetchMeetingByDay, selectedDay])

  let sameSwipe: boolean = false

  const bind = useDrag(({ down, movement: [mx] }) => {
    if (!down) {
      sameSwipe = !sameSwipe
    }

    if (mx > 200 && sameSwipe) {
      prevDay()
    } else if (mx < -200 && sameSwipe) {
      nextDay()
    }
  })

  const NoMeetings = () => {
    return (
      <div className='container'>
        <Coffee />
        <p>Ingen møder på denne dag</p>
        <style jsx>{`
          .container {
            border-radius: var(--border-radius);
            background-color: #ccc;
            padding: 25px;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            text-align: center;
          }
        `}</style>
      </div>
    )
  }

  const AddBtn = () => {
    const d = new Date()
    d.setHours(0)
    d.setMinutes(0)
    d.setSeconds(0)
    d.setMilliseconds(0)
    return (
      d.getTime() <= selectedDay.getTime() && (
        <Plus onClick={() => setShowModal(!showModal)} />
      )
    )
  }

  return (
    <div {...bind()}>
      <Page title='Møder' showBackButton component={<AddBtn />}>
        <BottomModal
          show={showModal}
          content={
            <MobileMultiSelecter
              callBack={fetchMeetings}
              setShowModal={setShowModal}
              initDate={selectedDay}
            />
          }
          setShow={setShowModal}
        />
        <MiddelLoader
          loading={meetingStore.fetchState === FetchStates.LOADING}
        />
        <div className='bar'>
          <div className='date'>
            {selectedDay.toString() !== 'Invalid Date'
              ? selectedDay.toLocaleDateString()
              : 'Henter...'}
          </div>
          <div className='float-left arrowbtn'>
            <ChevronLeft
              className='noSelect'
              tabIndex={0}
              onKeyPress={e => console.log(e)}
              onClick={prevDay}
              color='white'
            />
          </div>

          <div className='float-right arrowbtn'>
            <ChevronRight
              className='noSelect'
              tabIndex={0}
              onKeyPress={arrowKeys}
              onClick={nextDay}
              color='white'
            />
          </div>
        </div>
        <Section>
          <ul data-cy='meeting-list'>
            {events?.length === 0 && <NoMeetings />}
            {events?.sort(sortEventByDate)?.map(m => (
              <li key={m.shortId}>
                <Link href='/meeting/[mid]' as={`/meeting/${m.shortId}`}>
                  <a style={{ width: '100%' }}>
                    <p style={{ display: 'inline' }}>
                      {Moment(applyOffSet(m.startTime)).format('HH:mm')}
                    </p>
                    <p className='text'>{m.name}</p>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
        <style jsx>{`
          ul {
            margin-top: 40px;
          }
          .text {
            width: fit-content;
            max-width: 90vw;
            display: inline;
            margin-left: 15px;
          }

          .arrow {
            float: right;
            display: inline-block;
            white-space: nowrap;
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
            background-color: var(--accent);
            height: 35px;
            width: 100%;
            left: 0;
            top: calc(var(--safe-area-inset-top) / 2 + var(--top-bar-height));
            position: fixed;
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
      </Page>
    </div>
  )
})

export default withAuth(Day)

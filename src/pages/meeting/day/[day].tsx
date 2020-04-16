import { useEffect, useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Page from '../../../components/page'
import Section from '../../../components/section'

import meetingStore from '../../../stores/MeetingStore'
import MeetingModel from '../../../models/MeetingModel'

const Day: NextPage = observer(() => {
  const router = useRouter()
  const { day } = router.query
  console.log('====================================')
  console.log(day)
  console.log('====================================')
  const [selectedDay, setSelectedDay] = useState(new Date(String(day)))
  const [events, setEvents] = useState([] as MeetingModel[])
  const meetingStoreContext = useContext(meetingStore)

  useEffect(() => {
    meetingStoreContext.fetchMeetings(selectedDay, selectedDay).then(() => {
      setEvents(meetingStoreContext.meetings)
      console.log('====================================')
      console.log(meetingStoreContext.meetings)
      console.log('====================================')
    })
  }, [meetingStoreContext, selectedDay])

  return (
    <Page title={selectedDay.toDateString()} showBackButton={false}>
      <Section>
        <ul>
          {events.length === 0 && <li>Ingen møder på denne dag</li>}
          {events.map(m => (
            <li>{m.name}</li>
          ))}
        </ul>
      </Section>
      <style jsx>{`
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
  )
})

export default Day

import * as React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'

class EventCalendar extends React.Component<Props, State> {
  calendarComponentRef: {
    current: HTMLDivElement | null
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      events: [],
      calendarEvents: [],
      calendarReminders: []
    }
    this.calendarComponentRef = React.createRef()
  }

  render() {
    const { calendarEvents, calendarReminders } = this.state
    return (
      <>
        <FullCalendar
          ref={this.calendarComponentRef}
          header={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay,listWeek'
          }}
          height='auto'
          defaultView='timeGridDay'
          plugins={[dayGridPlugin, timeGridPlugin]}
          events={[...calendarEvents, ...calendarReminders]}
          allDaySlot={false}
        />
      </>
    )
  }
}

export default EventCalendar

import React from 'react'
import Router from 'next/router'
import InfiniteCalendar from 'react-infinite-calendar'
import WindowDimensions from '../models/types/WindowDimensions'
import { daysShort } from '../services/dateService'

// Render the Calendar
const today = new Date()
// const lastWeek = new Date(
//   today.getFullYear(),
//   today.getMonth(),
//   today.getDate() - 7
// )

type props = {
  dim: WindowDimensions
}

// const da = dynamic(() => )

const MobileCalendar = ({ dim }: props) => {
  const onDaySelect = (date: Date) => {
    Router.push(`/meeting/day?date=${date.getTime()}`)
  }

  return (
    <>
      <InfiniteCalendar
        locale={{
          headerFormat: 'dddd, D MMM',
          weekdays: daysShort(),
          blank: 'Ingen dag valgt',
          todayLabel: { long: 'I dag' }
        }}
        width={dim.width}
        height={dim.height - 300}
        selected={today}
        onSelect={onDaySelect}
        theme={{
          accentColor: 'var(--accent)',
          floatingNav: {
            background: 'var(--surface)',
            chevron: 'var(--accent)',
            color: 'var(--accent)'
          },
          headerColor: 'var(--accent)',
          selectionColor: '#19896f',
          textColor: {
            active: '#FFF',
            default: 'var(--text)'
          },
          todayColor: 'var(--accent)',
          weekdayColor: 'var(--accent)'
        }}
      />
      <style jsx global>{`
        .Cal__MonthList__root.Cal__MonthList__scrolling {
          background-color: var(--base) !important;
        }
        .Cal__Day__today {
          color: var(--text) !important;
          font-weight: 600;
        }
        .Cal__Day__enabled {
          color: var(--text) !important;
        }
        .Cal__MonthList__root {
          background-color: rgba(51, 51, 51, 0) !important;
        }
        .Cal__Container__listWrapper {
          background-color: rgba(51, 51, 51, 0) !important;
        }
        .Cal__Month__row:first-child li {
          background-color: var(--base) !important;
        }
      `}</style>
    </>
  )
}

export default MobileCalendar

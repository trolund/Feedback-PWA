import React, { useEffect, useState } from 'react'
import Router from 'next/router'
import Calendar from 'react-calendar-mobile'
import InfiniteCalendar from 'react-infinite-calendar'
import WindowDimensions from '../models/types/WindowDimensions'
import { daysShort } from '../services/dateService'
import { EventInput } from '@fullcalendar/core'
import dynamic from 'next/dynamic'

// Render the Calendar
const today = new Date()
// const lastWeek = new Date(
//   today.getFullYear(),
//   today.getMonth(),
//   today.getDate() - 7
// )

type props = {
  dim: WindowDimensions
  events: EventInput[]
}

const Mv2 = dynamic(() => import('react-calendar-mobile'), {
  ssr: false
})

const MobileCalendarV2 = ({ dim, events }: props) => {
  let FullCalendarNoSSRWrapper = null
  const [first, setfirst] = useState(true)

  const onDaySelect = (date: Date) => {
    Router.push(`/meeting/day?date=${date.getTime()}`)
    console.log(date.toDateString())
  }

  FullCalendarNoSSRWrapper = dynamic({
    modules: () =>
      ({
        calendar: import('react-calendar-mobile')
      } as any),
    render: (props: any, { calendar: Calendar, ...plugins }) => (
      <Calendar i18n='da-dk' {...props} />
    ),
    loading: () => <p>loading...</p>,
    ssr: false
  })

  const formatDateEventInput = date => {
    if (typeof date === 'object') {
      return `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(
        -2
      )}-${`0${date.getDate()}`.slice(-2)}`
    }
  }

  // const setDecorate = () => {
  //   const todecorate = events?.map(e => {
  //     return { [formatDateEventInput(e.date)]: true }
  //   })

  //   let returnObj = {}
  //   for (let key in todecorate) {
  //     returnObj = { ...returnObj, [key]: todecorate[key] }
  //   }

  //   console.log('dec', returnObj)

  //   return returnObj
  // }
  const setDecorate = () => {
    const today = new Date()
    const threeDays = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 3
    )
    const sixDays = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 6
    )
    return {
      [formatDateEventInput(today)]: true,
      [formatDateEventInput(threeDays)]: true,
      [formatDateEventInput(sixDays)]: {}
    }
  }

  return (
    <>
      <FullCalendarNoSSRWrapper
        weekFormat='long'
        decorate={setDecorate()}
        startOnMonday={true}
        onSelectDate={(v, s) => {
          // if (!first) {
          //   onDaySelect(v)
          // } else {
          //   setfirst(false)
          // }
          // console.log(first)
          console.log(v, s)
        }}
        onChange={v => console.log(v)}
      />
      <style jsx>{``}</style>
    </>
  )
}

export default MobileCalendarV2

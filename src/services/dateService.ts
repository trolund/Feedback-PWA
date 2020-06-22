/* eslint-disable no-debugger */
/* eslint-disable import/prefer-default-export */
import Moment from 'moment'
import MeetingModel from '../models/MeetingModel'

export const applyDates = (meeting: MeetingModel) => {
  return {
    ...meeting,
    startTime: Moment(meeting.startTime)
      .utc(true)
      .toDate(),
    endTime: Moment(meeting.endTime)
      .utc(true)
      .toDate()
  } as MeetingModel
}

export const applyOffSet = (date: Date): Date => {
  // only add offset if utc
  if (Moment(date).isUTC()) {
    const utcOffset = Moment().utcOffset()
    const localTime = Moment(date).add(utcOffset, 'minutes')
    const dateres = Moment(localTime).toDate()
    return Moment(localTime).toDate()
  } else {
    return Moment(date).toDate()
  }
}

export const applyOffSetToMeeting = (meeting: MeetingModel) => {
  const returnMeeting = meeting
  returnMeeting.endTime = applyOffSet(returnMeeting.endTime)
  returnMeeting.startTime = applyOffSet(returnMeeting.startTime)
  return returnMeeting
}

export const spliceDateAndTime = (datePart: Date, timePart: Date): Date => {
  const returnDate: Date = new Date()
  returnDate.setUTCFullYear(datePart.getUTCFullYear())
  returnDate.setDate(datePart.getDate())
  returnDate.setMonth(datePart.getMonth())
  returnDate.setHours(timePart.getHours())
  returnDate.setMinutes(timePart.getMinutes())
  returnDate.setSeconds(0)
  returnDate.setMilliseconds(0)
  return returnDate
}

export const applyLocalDatesInMeeting = (
  meeting: MeetingModel
): MeetingModel => {
  const updatedMeeting = meeting
  updatedMeeting.startTime = Moment(meeting.startTime)
    .local()
    .toDate()
  updatedMeeting.endTime = Moment(meeting.endTime)
    .local()
    .toDate()
  return updatedMeeting
}

export const convertAllDatesToLocal = (
  meetings: MeetingModel[]
): MeetingModel[] => {
  const list = meetings.map(m => applyOffSetToMeeting(m))
  // console.log(list)

  return list
}

export const applyUTCDatesInMeeting = (meeting: MeetingModel): MeetingModel => {
  const updatedMeeting = meeting
  updatedMeeting.startTime = Moment(meeting.startTime)
    .utc()
    .toDate()
  updatedMeeting.endTime = Moment(meeting.endTime)
    .utc()
    .toDate()
  return updatedMeeting
}

export const days = [
  'Søndag',
  'Mandag',
  'Tirsdag',
  'Onsdag',
  'Torsdag',
  'Fredag',
  'Lørdag',
  'Søndag'
]

export const months = [
  'Januar',
  'Februar',
  'Marts',
  'April',
  'Maj',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'December'
]

export const monthString = (date: Date): string => {
  const m = months[date.getMonth()]
  const y = date.getUTCFullYear()
  return `${m} ${y}`
}

export const daysShort = () => days.map(d => d.slice(0, 3))

export const startAndEndOfWeek = date => {
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

export const getWeekNumber = (d: Date) => {
  const newDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  newDate.setUTCDate(newDate.getUTCDate() + 4 - (newDate.getUTCDay() || 7))

  const yearStart = new Date(Date.UTC(newDate.getUTCFullYear(), 0, 1))

  const weekNo = Math.ceil(
    ((newDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  )

  return weekNo
}

export const formatDateEventInput = date => {
  if (typeof date === 'object') {
    return `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(
      -2
    )}-${`0${date.getDate()}`.slice(-2)}`
  }
}

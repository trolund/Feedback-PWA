/* eslint-disable no-debugger */
/* eslint-disable import/prefer-default-export */
import Moment from 'moment'
import MeetingModel from '../models/MeetingModel'

export const applyOffSet = (date: Date): Date => {
  const utcOffset = Moment().utcOffset()
  const localTime = Moment(date).add(utcOffset, 'minutes')
  return Moment(localTime).toDate()
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
  console.log(list)

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
  'Søndag'
]

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

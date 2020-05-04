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

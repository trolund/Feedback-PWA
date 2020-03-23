import MeetingCategory from './MeetingCategory'

export default interface MeetingModel {
  shortId?: string
  createdBy?: string
  location?: string
  name: string
  startTime: Date
  endTime: Date
  discription: string
  topic?: string
  questionsSetId?: string
  meetingCategories?: MeetingCategory[]
}

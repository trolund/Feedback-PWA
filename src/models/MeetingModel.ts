import MeetingCategory from "./MeetingCategory";

interface MeetingModel {
  shortId?: string;
  createdBy?: string;
  location?: string;
  name: string;
  startTime: Date;
  endTime: Date;
  discription: string;
  topic?: string;
  questionsSetId?: string;
  meetingCategories: MeetingCategory[];
}
export default MeetingModel;

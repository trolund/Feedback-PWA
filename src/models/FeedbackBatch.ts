import FeedbackModel from "./FeedbackModel";

interface FeedbackBatch {
  meetingId: number;
  feedback: FeedbackModel[];
}

export default FeedbackBatch;

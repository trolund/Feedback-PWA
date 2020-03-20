interface Feedback {
  question: string;
  voteAVG: number;
  comments: string[];
}

interface FeedbackModel {
  QuestionId: string;
  Answer: number;
  Comment: string;
}

export default Feedback;

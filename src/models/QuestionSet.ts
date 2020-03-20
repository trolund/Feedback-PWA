import Question from "./Question";

interface QuestionSet {
  questionSetId: string;
  name: string;
  questions: Question[];
}

export default QuestionSet;

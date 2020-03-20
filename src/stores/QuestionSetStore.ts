import { decorate, observable } from "mobx";
import states from "./requestState";
import authService from "../components/api-authorization/AuthorizeService";
import { createContext } from "react";
import MeetingModel from "../models/MeetingModel";
import ApiRoutes from "../api/ApiRoutes";
import QuestionSet from "../models/QuestionSet";
import Question from "../models/Question";

const baseUrl =
  process.env.NODE_ENV === "development" ? process.env.REACT_APP_BASE_URL : "";

class QuestionSetStore {
  // status
  state = states.DONE;
  msg = "";

  // data
  QSetNames: QuestionSet[] = [];
  qSet: QuestionSet | null = null;

  constructor() {
    this.fetchQuestionSetNames();
  }

  async fetchQuestionSetNames() {
    this.state = states.LOADING;
    try {
      const url = ApiRoutes.QuestionSetNames;
      const token = await authService.getAccessToken();

      const response = await fetch(url, {
        headers: !token ? {} : { Authorization: `Bearer ${token}` }
      });
      this.msg = response.statusText;

      const data: QuestionSet[] = await response.json();
      this.QSetNames = data;
    } catch (e) {
      this.state = states.FAILED;
      this.msg = e.statusText;
      this.QSetNames = [];
    }
  }

  async fetchQuestionSet(questionId: string) {
    this.state = states.LOADING;
    try {
      const url = ApiRoutes.QuestionSetById(questionId);
      const token = await authService.getAccessToken();

      const response = await fetch(url, {
        headers: !token ? {} : { Authorization: `Bearer ${token}` }
      });
      this.msg = response.statusText;

      const data: QuestionSet = await response.json();
      this.qSet = data;
    } catch (e) {
      this.state = states.FAILED;
      this.msg = e.statusText;
      this.qSet = null;
    }
  }
}

decorate(QuestionSetStore, {
  QSetNames: observable
});

export const questionSetStore = createContext(new QuestionSetStore());

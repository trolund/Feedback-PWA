import { decorate, observable } from "mobx";
import states from "./requestState";
import authService from "../components/api-authorization/AuthorizeService";
import { createContext } from "react";
import MeetingModel from "../models/MeetingModel";
import ApiRoutes from "../api/ApiRoutes";
import QuestionSet from "../models/QuestionSet";
import FeedbackBatch from "../models/FeedbackBatch";

const baseUrl =
  process.env.NODE_ENV === "development" ? process.env.REACT_APP_BASE_URL : "";

class FeedbackStore {
  // status
  state = states.DONE;
  msg = "";

  // data
  feedbackBatch: FeedbackBatch[] | null = null;

  constructor() {}

  async fetchFeedback(meetingId: string) {
    this.state = states.LOADING;
    try {
      const url = `Api/FeedbackBatch/${meetingId}`; //ApiRoutes.Feedbackbatch(meetingId);

      const token = await authService.getAccessToken();

      const response = await fetch(url, {
        method: "GET",
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
        redirect: "follow"
      });
      this.msg = response.statusText;

      const data: FeedbackBatch[] = await response.json();

      this.feedbackBatch = data;
    } catch (e) {
      this.state = states.FAILED;
      this.msg = e.statusText;
      this.feedbackBatch = null;
    }
  }
}

decorate(FeedbackStore, {
  feedbackBatch: observable
});

export const feedbackStore = createContext(new FeedbackStore());

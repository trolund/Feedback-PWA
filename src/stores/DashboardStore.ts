import { decorate, observable } from "mobx";
import states from "./requestState";
import authService from "../components/api-authorization/AuthorizeService";
import { createContext } from "react";
import ApiRoutes from "../api/ApiRoutes";
import FeedbackMonth from "../models/FeedbackMonth";

class DashboardStore {
  // status
  state = states.DONE;
  msg = "";

  // data
  data: FeedbackMonth[] | null = null;

  async fetchDashboard(
    start: Date,
    end: Date,
    categories?: string[],
    searchWord?: string
  ) {
    this.state = states.LOADING;
    try {
      const url = ApiRoutes.DashboardMonth(start, end, categories, searchWord);

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

      const data: FeedbackMonth[] = await response.json();
      this.state = states.DONE;
      this.data = data;
    } catch (e) {
      this.state = states.FAILED;
      this.msg = e.statusText;
      this.data = null;
    }
  }
}

decorate(DashboardStore, {
  data: observable
});

export const dashboardStore = createContext(new DashboardStore());

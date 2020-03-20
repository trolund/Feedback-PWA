import { decorate, observable } from "mobx";
import states from "./requestState";
import authService from "../components/api-authorization/AuthorizeService";
import { createContext } from "react";
import MeetingModel from "../models/MeetingModel";
import Meeting from "../pages/Meeting/Meeting";
import IStore from "./IStore";
import ApiRoutes from "../api/ApiRoutes";

const baseUrl =
  process.env.NODE_ENV === "development" ? process.env.REACT_APP_BASE_URL : ""; //Check if dev

class MeetingStore implements IStore {
  // status
  state = states.DONE;
  meetingCreatedState = states.DONE;
  msg = "";

  // data
  meetings: MeetingModel[] = [];
  meeting: MeetingModel | null = null;

  constructor() {}

  // /Api/Meeting/ByDate

  async create(entity: MeetingModel) {
    this.meetingCreatedState = states.LOADING;
    try {
      const url = "Api/Meeting/Create";
      const token = await authService.getAccessToken();
      const json = JSON.stringify(entity);
      console.log(json);

      const response = await fetch(url, {
        method: "POST",
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
        body: json,
        redirect: "follow"
      });
      console.log(response);
      this.msg = response.statusText;
      if (response.status === 200) {
        this.meetingCreatedState = states.DONE;
      } else {
        this.meetingCreatedState = states.FAILED;
      }
    } catch (e) {
      this.meetingCreatedState = states.FAILED;
      this.msg = e.statusText;
      this.meetings = [];
    }

    //   async fetchUsers() {
    //     this.state = states.LOADING;
    //     try {
    //       const url = baseUrl + "/Create";
    //       const token = await authService.getAccessToken();

    //       const response = await fetch(url, {
    //         headers: !token ? {} : { Authorization: `Bearer ${token}` }
    //       });
    //       console.log(response);
    //       this.msg = response.statusText;

    //       const data = await response.json();
    //       this.meetings = data;
    //     } catch (e) {
    //       this.state = states.FAILED;
    //       this.msg = e.statusText;
    //       this.meetings = [];
    //     }
  }

  async update(entity: MeetingModel) {
    this.meetingCreatedState = states.LOADING;
    try {
      const url = "Api/Meeting";
      const token = await authService.getAccessToken();
      const json = JSON.stringify(entity);
      const response = await fetch(url, {
        method: "PUT",
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
        body: json,
        redirect: "follow"
      });

      this.msg = response.statusText;
      if (response.status === 200) {
        this.meetingCreatedState = states.DONE;
      } else {
        this.meetingCreatedState = states.FAILED;
      }
    } catch (e) {
      this.meetingCreatedState = states.FAILED;
      this.msg = e.statusText;
      this.meetings = [];
    }
  }

  async delete(entity: MeetingModel) {
    this.meetingCreatedState = states.LOADING;
    try {
      const url = "Api/Meeting/Delete";
      const token = await authService.getAccessToken();
      const json = JSON.stringify(entity);
      const response = await fetch(url, {
        method: "DELETE",
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
        body: json,
        redirect: "follow"
      });

      this.msg = response.statusText;
      if (response.status === 200) {
        this.meetingCreatedState = states.DONE;
      } else {
        this.meetingCreatedState = states.FAILED;
      }
    } catch (e) {
      this.meetingCreatedState = states.FAILED;
      this.msg = e.statusText;
      this.meetings = [];
    }
  }

  set updateDiscripton(newDisscription: string) {
    const model = {
      ...this.meeting,
      discription: newDisscription
    } as MeetingModel;
    this.meeting = model;
  }

  set updateName(name: string) {
    const model = {
      ...this.meeting,
      name: name
    } as MeetingModel;
    this.meeting = model;
  }

  set updateStartTime(time: Date) {
    const model = {
      ...this.meeting,
      startTime: time
    } as MeetingModel;
    this.meeting = model;
  }

  set updateEndTime(time: Date) {
    const model = {
      ...this.meeting,
      endTime: time
    } as MeetingModel;
    this.meeting = model;
  }

  async fetchMeetings(start: Date, end: Date) {
    this.state = states.LOADING;
    try {
      const url = ApiRoutes.MeetingsByDates(start, end);
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
      this.state = states.DONE;

      const data = await response.json();
      console.log("fetch mmeting response: ", data);
      this.meetings = data;
    } catch (e) {
      this.state = states.FAILED;
      this.msg = e.statusText;
      this.meetings = [];
    }
  }
  // /Api/Meeting/ShortId/{id}
  async fetchMeetingByShortId(id: string) {
    this.state = states.LOADING;
    try {
      const url = `Api/Meeting/ShortId/${id}`;
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
      this.state = states.DONE;

      const data = await response.json();
      console.log("fetch mmeting response: ", data);
      this.meeting = data;
    } catch (e) {
      this.state = states.FAILED;
      this.msg = e.statusText;
      this.meeting = null;
    }
  }
}

decorate(MeetingStore, {
  meetings: observable
});

decorate(MeetingStore, {
  meeting: observable
});

decorate(MeetingStore, {
  state: observable
});

export const meetingStore = createContext(new MeetingStore());

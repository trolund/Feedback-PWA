import { observable, action } from 'mobx'
import { createContext } from 'react'
import FetchStates from './requestState'
import MeetingModel from '../models/MeetingModel'
import { getToken } from '../services/authService'
import ApiRoutes from './api/ApiRoutes'
import OptionsValue from '../models/OptionsValue'

class MeetingStore {
  // status
  @observable state = FetchStates.DONE

  @observable meetingCreatedState = FetchStates.DONE

  @observable msg = ''

  // data
  @observable meetings: MeetingModel[] = []

  @observable meeting: MeetingModel | null = null

  // /Api/Meeting/ByDate

  @action setMeeting = (meeting: MeetingModel) => {
    this.meeting = meeting
  }

  @action create = async (entity: MeetingModel) => {
    this.meetingCreatedState = FetchStates.LOADING
    try {
      const url = ApiRoutes.createMeeting
      const token = getToken()
      const json = JSON.stringify(entity)
      console.log(json)

      const response = await fetch(url, {
        method: 'POST',
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
        body: json,
        redirect: 'follow'
      })
      console.log(response)
      this.msg = response.statusText
      if (response.status === 200) {
        this.meetingCreatedState = FetchStates.DONE
      } else {
        this.meetingCreatedState = FetchStates.FAILED
      }
    } catch (e) {
      this.meetingCreatedState = FetchStates.FAILED
      this.msg = e.statusText
      this.meetings = []
    }
  }

  @action setDiscription = (dis: string) => {
    this.meeting.discription = dis
  }

  @action setTitle = (title: string) => {
    this.meeting.name = title
  }

  // @action setTags = (tags: OptionsValue[], companyId: string) => {
  //   this.meeting.meetingCategories = tags.map(item => {
  //     const cat: MeetingCategory = {
  //       meetingId: this.meeting.shortId
  //       // category: { categoryId: item.value, companyId: Number(companyId) }
  //     }

  //     return cat
  //   })
  // }

  @action getTags = () => {
    return this.meeting?.meetingCategories.map(
      item => ({ label: item.name, value: item.categoryId } as OptionsValue)
    )
  }

  @action update = async (entity: MeetingModel) => {
    this.meetingCreatedState = FetchStates.LOADING
    try {
      const url = ApiRoutes.updateMeeting
      const token = getToken()
      const json = JSON.stringify(entity)
      const response = await fetch(url, {
        method: 'PUT',
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
        body: json,
        redirect: 'follow'
      })

      this.msg = response.statusText
      if (response.status === 200) {
        this.meetingCreatedState = FetchStates.DONE
        return FetchStates.DONE
      }
      this.meetingCreatedState = FetchStates.FAILED
      return FetchStates.FAILED
    } catch (e) {
      this.meetingCreatedState = FetchStates.FAILED
      this.msg = e.statusText
      this.meetings = []
      return FetchStates.FAILED
    }
  }

  @action deleteMeeting = async (entity: MeetingModel) => {
    this.meetingCreatedState = FetchStates.LOADING
    try {
      const url = ApiRoutes.deleteMeeting
      const token = getToken()
      const json = JSON.stringify(entity)
      const response = await fetch(url, {
        method: 'DELETE',
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
        body: json,
        redirect: 'follow'
      })

      this.msg = response.statusText
      if (response.status === 200) {
        this.meetingCreatedState = FetchStates.DONE
      } else {
        this.meetingCreatedState = FetchStates.FAILED
      }
    } catch (e) {
      this.meetingCreatedState = FetchStates.FAILED
      this.msg = e.statusText
      this.meetings = []
    }
  }

  @action updateDiscripton = (newDisscription: string) => {
    const model = {
      ...this.meeting,
      discription: newDisscription
    } as MeetingModel
    this.meeting = model
  }

  updateName = (name: string) => {
    const model = {
      ...this.meeting,
      name
    } as MeetingModel
    this.meeting = model
  }

  @action updateStartTime = (time: Date) => {
    const model = {
      ...this.meeting,
      startTime: time
    } as MeetingModel
    this.meeting = model
  }

  @action updateEndTime = (time: Date) => {
    const model = {
      ...this.meeting,
      endTime: time
    } as MeetingModel
    this.meeting = model
  }

  @action fetchMeetings = async (start: Date, end: Date) => {
    this.state = FetchStates.LOADING
    try {
      const url = ApiRoutes.MeetingsByDates(start, end)
      const token = getToken()
      const response = await fetch(url, {
        method: 'GET',
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
        redirect: 'follow'
      })

      this.msg = response.statusText
      this.state = FetchStates.DONE

      const data = await response.json()
      console.log('fetch mmeting response: ', data)
      this.meetings = data
    } catch (e) {
      this.state = FetchStates.FAILED
      this.msg = e.statusText
      this.meetings = []
    }
  }

  // /Api/Meeting/ShortId/{id}
  @action fetchMeetingByShortId = async (id: string) => {
    this.state = FetchStates.LOADING
    try {
      const url = ApiRoutes.meetingByShortId(id)
      const token = getToken()
      const response = await fetch(url, {
        method: 'GET',
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
        redirect: 'follow'
      })

      this.msg = response.statusText
      this.state = FetchStates.DONE

      const data: MeetingModel = await response.json()
      console.log('fetch mmeting response: ', data)
      this.meeting = data
    } catch (e) {
      this.state = FetchStates.FAILED
      this.msg = e.statusText
      this.meeting = null
    }
  }
}

// decorate(MeetingStore, {
//   meetings: observable
// })

// decorate(MeetingStore, {
//   meeting: observable
// })

// decorate(MeetingStore, {
//   state: observable
// })

const meetingStore = createContext(new MeetingStore())

export default meetingStore

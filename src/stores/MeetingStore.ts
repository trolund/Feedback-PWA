import { observable, action } from 'mobx'
import { createContext } from 'react'
import states from './requestState'
import MeetingModel from '../models/MeetingModel'
import IStore from './IStore'
import AuthService from './api/authService'
import ApiRoutes from './api/ApiRoutes'
import MeetingCategory from '../models/MeetingCategory'
import OptionsValue from '../models/OptionsValue'

class MeetingStore implements IStore {
  // status
  @observable state = states.DONE

  @observable meetingCreatedState = states.DONE

  @observable msg = ''

  // data
  @observable meetings: MeetingModel[] = []

  @observable meeting: MeetingModel | null = null

  // /Api/Meeting/ByDate

  @action create = async (entity: MeetingModel) => {
    this.meetingCreatedState = states.LOADING
    try {
      const url = ApiRoutes.createMeeting
      const token = AuthService.getToken()
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
        this.meetingCreatedState = states.DONE
      } else {
        this.meetingCreatedState = states.FAILED
      }
    } catch (e) {
      this.meetingCreatedState = states.FAILED
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

  @action setTags = (tags: OptionsValue[], companyId: string) => {
    this.meeting.meetingCategories = tags.map(item => {
      const cat: MeetingCategory = {
        meetingId: this.meeting.shortId,
        category: { categoryId: item.value, companyId: Number(companyId) }
      }

      return cat
    })
  }

  @action getTags = () => {
    return this.meeting?.meetingCategories.flatMap(item => item.category)
  }

  @action update = async (entity: MeetingModel) => {
    this.meetingCreatedState = states.LOADING
    try {
      const url = ApiRoutes.updateMeeting
      const token = AuthService.getToken()
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
        this.meetingCreatedState = states.DONE
      } else {
        this.meetingCreatedState = states.FAILED
      }
    } catch (e) {
      this.meetingCreatedState = states.FAILED
      this.msg = e.statusText
      this.meetings = []
    }
  }

  @action deleteMeeting = async (entity: MeetingModel) => {
    this.meetingCreatedState = states.LOADING
    try {
      const url = ApiRoutes.deleteMeeting
      const token = AuthService.getToken()
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
        this.meetingCreatedState = states.DONE
      } else {
        this.meetingCreatedState = states.FAILED
      }
    } catch (e) {
      this.meetingCreatedState = states.FAILED
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
    this.state = states.LOADING
    try {
      const url = ApiRoutes.MeetingsByDates(start, end)
      const token = AuthService.getToken()
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
      this.state = states.DONE

      const data = await response.json()
      console.log('fetch mmeting response: ', data)
      this.meetings = data
    } catch (e) {
      this.state = states.FAILED
      this.msg = e.statusText
      this.meetings = []
    }
  }

  // /Api/Meeting/ShortId/{id}
  @action fetchMeetingByShortId = async (id: string) => {
    this.state = states.LOADING
    try {
      const url = ApiRoutes.meetingByShortId(id)
      const token = AuthService.getToken()
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
      this.state = states.DONE

      const data: MeetingModel = await response.json()
      console.log('fetch mmeting response: ', data)
      this.meeting = data
    } catch (e) {
      this.state = states.FAILED
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

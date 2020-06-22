import { observable, action } from 'mobx'
import FetchStates from './requestState'
import ApiRoutes from './api/ApiRoutes'
import UserAdmin from '../models/user-admin'
import userAdminQuery from '../models/userAdminQuery'
import { getToken } from '../services/authService'
import IStoreFetchState from './StoreFetchState'

export default class UserAdminStore implements IStoreFetchState {
  @observable fetchState: FetchStates = FetchStates.DONE

  @observable msg = ''

  @observable users: UserAdmin[] = null

  @action clear = () => {
    this.users = []
  }

  @action fetchUsers = async (query: userAdminQuery): Promise<FetchStates> => {
    this.fetchState = FetchStates.LOADING
    try {
      const url = new URL(ApiRoutes.updateUserAdmin)
      url.search = new URLSearchParams({
        searchword: query.searchword ?? 'null',
        companyConfirmed: String(query.companyConfirmed ?? '-1'),
        pageNumber: String(query.pageNumber ?? '-1')
      }).toString()

      const token = getToken()
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
      })
      // console.log(response)

      this.msg = response.statusText
      const data = await response.json()

      // console.log(response, data)

      this.users = data
      this.fetchState = FetchStates.DONE
      return FetchStates.DONE
    } catch (e) {
      this.fetchState = FetchStates.FAILED
      this.msg = e.statusText
      this.users = null
      console.error(e)
      return FetchStates.FAILED
    }
  }

  @action updateUsers = async (
    usersToUpdate: UserAdmin[]
  ): Promise<FetchStates> => {
    this.fetchState = FetchStates.LOADING
    try {
      const url = ApiRoutes.updateUserAdmin
      const token = getToken()
      const json = JSON.stringify(usersToUpdate)
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
      const data = await response.json()

      this.users = data
      this.fetchState = FetchStates.DONE
      return FetchStates.DONE
    } catch (e) {
      this.fetchState = FetchStates.FAILED
      this.msg = e.statusText
      this.users = null
      return FetchStates.FAILED
    }
  }
}

// const userAdminStore = createContext(new UserAdminStore())

// export default userAdminStore

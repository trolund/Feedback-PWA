import { observable, action } from 'mobx'
import { createContext } from 'react'
import states from './requestState'
import ApiRoutes from './api/ApiRoutes'
import UserAdmin from '../models/user-admin'
import userAdminQuery from '../models/userAdminQuery'
import AuthService from '../services/authService'

class UserAdminStore {
  @observable fetchState: states | null = null

  @observable msg = null

  @observable users: UserAdmin[] = null

  @action fetchUsers = async (query: userAdminQuery): Promise<states> => {
    this.fetchState = states.LOADING
    try {
      const url = new URL(ApiRoutes.updateUserAdmin)
      url.search = new URLSearchParams({
        searchword: query.searchword ?? 'null',
        companyConfirmed: String(query.companyConfirmed ?? '-1'),
        pageNumber: String(query.pageNumber ?? '-1')
      }).toString()

      const token = AuthService.getToken()
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
      })
      console.log(response)

      this.msg = response.statusText
      const data = await response.json()

      console.log(response, data)

      this.users = data
      this.fetchState = states.DONE
      return states.DONE
    } catch (e) {
      this.fetchState = states.FAILED
      this.msg = e.statusText
      this.users = null
      console.error(e)
      return states.FAILED
    }
  }

  @action updateUsers = async (usersToUpdate: UserAdmin[]): Promise<states> => {
    this.fetchState = states.LOADING
    try {
      const url = ApiRoutes.updateUserAdmin
      const token = AuthService.getToken()
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
      this.fetchState = states.DONE
      return states.DONE
    } catch (e) {
      this.fetchState = states.FAILED
      this.msg = e.statusText
      this.users = null
      return states.FAILED
    }
  }
}

const userAdminStore = createContext(new UserAdminStore())

export default userAdminStore

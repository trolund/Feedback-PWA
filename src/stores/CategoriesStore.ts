import { observable, action } from 'mobx'
import { createContext } from 'react'
import states from './requestState'
import Category from '../models/Category'
import ApiRoutes from './api/ApiRoutes'
import AuthService from '../services/authService'

class CategoriesStore {
  // status
  @observable state = states.DONE

  @observable msg = ''

  // data
  @observable categories: Category[] | null = null

  @action async fetchCategories(companyId: string) {
    this.state = states.LOADING
    try {
      const url = ApiRoutes.Categories(companyId)

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

      const data: Category[] = await response.json()

      this.categories = data
      this.state = states.DONE
    } catch (e) {
      this.state = states.FAILED
      this.msg = e.statusText
      this.categories = null
    }
  }
}

// decorate(CategoriesStore, {
//   categories: observable
// })
const categoriesStore = createContext(new CategoriesStore())

export default categoriesStore

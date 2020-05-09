import { observable, action } from 'mobx'
import { createContext } from 'react'
import FetchStates from './requestState'
import Category from '../models/Category'
import ApiRoutes from './api/ApiRoutes'
import { getToken } from '../services/authService'

export default class CategoriesStore {
  // status
  @observable state = FetchStates.DONE

  @observable msg = ''

  // data
  @observable categories: Category[] | null = null

  @action async fetchCategories(companyId: string) {
    this.state = FetchStates.LOADING
    try {
      const url = ApiRoutes.Categories(companyId)

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

      const data: Category[] = await response.json()

      this.categories = data
      this.state = FetchStates.DONE
    } catch (e) {
      this.state = FetchStates.FAILED
      this.msg = e.statusText
      this.categories = null
    }
  }
}

// decorate(CategoriesStore, {
//   categories: observable
// // })
// const categoriesStore = createContext(new CategoriesStore())

// export default categoriesStore

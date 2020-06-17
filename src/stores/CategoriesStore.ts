import { observable, action } from 'mobx'
import FetchStates from './requestState'
import Category from '../models/Category'
import ApiRoutes from './api/ApiRoutes'
import { getToken } from '../services/authService'
import IStoreFetchState from './StoreFetchState'

export default class CategoriesStore implements IStoreFetchState {
  // status
  @observable fetchState = FetchStates.DONE

  @observable msg = ''

  // data
  @observable categories: Category[] | null = null

  @action setCategories = (values: Category[]) => {
    this.categories = values
  }

  @action clear = () => {
    this.categories = null
  }

  @action fetchCategories = async (companyId: string) => {
    this.fetchState = FetchStates.LOADING
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
      this.fetchState = FetchStates.DONE
    } catch (e) {
      this.fetchState = FetchStates.FAILED
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

import { persist } from 'mobx-persist'
import { observable } from 'mobx'
import IQuestion from '../Question'

export default class Question implements IQuestion {
  @persist @observable questionId?: string

  @persist @observable questionSetId?: string

  @persist @observable theQuestion: string

  @persist @observable index: number
}

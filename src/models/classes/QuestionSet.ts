import { persist } from 'mobx-persist'
import { observable } from 'mobx'
import IQuestionSet from '../QuestionSet'
import Question from './Question'

export default class QuestionSet implements IQuestionSet {
  @persist @observable questionSetId?: string

  @persist @observable name: string

  @persist @observable companyId: number

  @persist('list', Question) @observable questions: Question[]
}

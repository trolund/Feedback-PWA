/// <reference types="jest" />

import {
  makeid,
  filterTempletes,
  prepareQuestionSetforUpdate
} from '../../src/services/utilsService'
import QuestionSet from '../../src/models/classes/QuestionSet'
import IQuestionSet from '../../src/models/QuestionSet'
import IQuestion from '../../src/models/Question'

describe('test utils', () => {
  describe('make id test', () => {
    it('make temp id', function() {
      const id = makeid(2)
      expect(id.length).toBe(2)
    })

    it('make temp id', function() {
      const id2 = makeid(20)
      expect(id2.length).toBe(20)
    })
  })
  describe('templete filter', () => {
    it('make temp id', function() {
      const array = [
        { companyId: 2 } as IQuestionSet,
        { companyId: 4 } as IQuestionSet,
        { companyId: 1 } as IQuestionSet,
        { companyId: 3 } as IQuestionSet
      ]
      expect(array.filter(n => filterTempletes(n, 1)).length).toBe(3)
    })

    it('make temp id 2', function() {
      const array = [
        { companyId: 1 } as IQuestionSet,
        { companyId: 1 } as IQuestionSet,
        { companyId: 1 } as IQuestionSet,
        { companyId: 3 } as IQuestionSet
      ]
      expect(array.filter(n => filterTempletes(n, 1)).length).toBe(1)
    })
  })
  describe('prepareQuestionSetforUpdate', () => {
    it('prepareQuestionSetforUpdate', function() {
      const qArray = [
        {
          index: 0,
          theQuestion: 'hvad?',
          questionId: makeid(5),
          questionSetId: makeid(6)
        } as IQuestion
      ]
      expect(
        prepareQuestionSetforUpdate({
          name: makeid(4),
          companyId: 1,
          questions: qArray
        } as IQuestionSet).questions.length
      ).toBe(1)
    })
  })
})

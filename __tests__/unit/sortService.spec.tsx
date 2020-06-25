/// <reference types="jest" />

import IQuestionSet from '../../src/models/QuestionSet'
import {
  sortQuestionsByIndex,
  sortEventByDate
} from '../../src/services/sortService'
import MeetingModel from '../../src/models/MeetingModel'

describe('sort service', () => {
  it('sort questions by index', function() {
    const data: IQuestionSet[] = require('../unit/data/questionSetarrayData.json')
    const questions = data[0].questions

    const res = questions.sort(sortQuestionsByIndex)

    let sortetRight = true

    res.forEach((element, i) => {
      if (element.index !== i) sortetRight = false
    })

    expect(sortetRight).toBe(true)
  })

  it('Sort meetings', function() {
    const data: MeetingModel[] = require('../unit/data/meetingArray.json')
    const res = data.sort(sortEventByDate)

    let sortetRight = true
    let lastTime = 0

    console.log(res)

    res.forEach((element, i) => {
      if (new Date(element.startTime).getTime() <= lastTime) sortetRight = false

      lastTime = new Date(element.startTime).getTime()
    })

    expect(sortetRight).toBe(true)
  })
})

/// <reference types="jest" />

import { getWeekNumber } from '../../src/services/dateService'
import CalculationService from '../../src/services/calculationService'
import FeedbackBatch from '../../src/models/FeedbackBatch'
import FeedbackDate from '../../src/models/FeedbackDate'
import GraphXScale from '../../src/models/GraphXScale'

describe('calc service test', () => {
  describe('week number test', () => {
    it('week test 1', function() {
      const WeekNumber = getWeekNumber(new Date('2020-06-25'))
      expect(WeekNumber).toBe(26)
    })

    it('week test 2', function() {
      const WeekNumber = getWeekNumber(new Date('2020-06-18'))
      expect(WeekNumber).toBe(25)
    })

    it('week test 3', function() {
      const calc = new CalculationService()
      const WeekNumber = calc.getWeekNumber(new Date('2020-06-11'))
      expect(WeekNumber).toBe(24)
    })
  })

  describe('Weeks in Year test', () => {
    it('2020 test 1', function() {
      const calc = new CalculationService()
      const weeksInYear = calc.weeksInYear(2020)
      expect(weeksInYear).toBe(53)
    })

    it('2021 test 2', function() {
      const calc = new CalculationService()
      const weeksInYear = calc.weeksInYear(2021)
      expect(weeksInYear).toBe(52)
    })

    it('2022 test 3', function() {
      const calc = new CalculationService()
      const weeksInYear = calc.weeksInYear(2022)
      expect(weeksInYear).toBe(52)
    })
  })

  describe('onlyUnique filter', () => {
    it('onlyUnique test 1', function() {
      const calc = new CalculationService()
      const array = [1, 2, 2, 2, 2, 3, 4]
      const onlyUnique = array.filter(calc.onlyUnique)
      expect(onlyUnique.length).toBe(4)
    })

    it('onlyUnique test 2', function() {
      const calc = new CalculationService()
      const array = [1, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 8]
      const onlyUnique = array.filter(calc.onlyUnique)
      expect(onlyUnique.length).toBe(8)
    })
  })

  describe('Feedback graph calc', () => {
    it('feedback date data to graph data', function() {
      const calc = new CalculationService()
      const data: FeedbackDate[] = require('../unit/data/feedbackDateData.json')
      const res = calc.calGraphData(data, true, GraphXScale.weeks, true)

      expect(res.labels.length).toBe(2)
      expect(res.labels.includes('25 2020')).toBe(true)
      expect(res.labels.includes('26 2020')).toBe(true)

      expect(res.dataPoints[0]).toBeGreaterThan(2)
      expect(res.dataPoints[1]).toBeGreaterThan(2.12)

      expect(res.numberOfProcessedItems).toBe(data.length)

      const onlyUniquefeedbackBatchs = data
        .map(i => i.feedbackBatchId)
        .filter(calc.onlyUnique)
      expect(res.numberOfBatches).toBe(onlyUniquefeedbackBatchs.length)

      expect(res.dataPoints.includes(0)).toBe(false)
    })

    it('feedback date data to graph data', function() {
      const calc = new CalculationService()
      const data: FeedbackDate[] = require('../unit/data/feedbackDateData.json')
      const res = calc.calGraphData(data, true, GraphXScale.mounths, false)

      expect(res.labels.length).toBe(1)
      expect(res.labels.includes('juni 2020')).toBe(true)

      expect(res.dataPoints[0]).toBeGreaterThan(2.12)

      expect(res.numberOfProcessedItems).toBe(data.length)

      const onlyUniquefeedbackBatchs = data
        .map(i => i.feedbackBatchId)
        .filter(calc.onlyUnique)
      expect(res.numberOfBatches).toBe(onlyUniquefeedbackBatchs.length)
    })

    it('feedback date data to graph data', function() {
      const calc = new CalculationService()
      const data: FeedbackDate[] = require('../unit/data/feedbackDateData.json')
      const res = calc.calGraphData(data, false, GraphXScale.mounths, false)

      expect(res.labels.length).toBe(12) // hele året 2020
      expect(res.labels.includes('juni 2020')).toBe(true)
      expect(res.labels.includes('dec 2020')).toBe(true)
      expect(res.labels.includes('jan 2020')).toBe(true)

      expect(res.dataPoints[0]).toBe(0)
      expect(res.dataPoints[res.dataPoints.length - 1]).toBe(0)

      expect(res.numberOfProcessedItems).toBe(data.length)

      const onlyUniquefeedbackBatchs = data
        .map(i => i.feedbackBatchId)
        .filter(calc.onlyUnique)
      expect(res.numberOfBatches).toBe(onlyUniquefeedbackBatchs.length)

      expect(res.dataPoints.includes(0)).toBe(true)
    })

    it('feedback date data to graph data', function() {
      const calc = new CalculationService()
      expect(calc.monthNames.length).toBe(12)
    })
  })
})

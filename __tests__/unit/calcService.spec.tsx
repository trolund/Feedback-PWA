/// <reference types="jest" />

import { getWeekNumber } from '../../src/services/dateService'
import CalculationService from '../../src/services/calculationService'

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
})

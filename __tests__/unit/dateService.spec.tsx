/// <reference types="jest" />

import { spliceDateAndTime } from '../../src/services/dateService'

describe('validate date manipulation', () => {
  describe('test password validation', () => {
    it('should combine DateAndTime', function() {
      const dateComponent = new Date('2025-12-24T13:40:10.000')
      const timeComponent = new Date('2020-10-23T12:50:00.000')
      const newDate = spliceDateAndTime(dateComponent, timeComponent)
      expect(newDate.toLocaleString()).toBe(
        new Date('2025-12-24T12:50:00.000').toLocaleString()
      )
    })
  })

  describe('test password validation', () => {
    it('UTC date to json', function() {
      const dateComponent = new Date('2025-12-24T13:40:10.000')

      const json = JSON.stringify(dateComponent.toISOString())

      const date = JSON.parse(json)

      expect(new Date(date).toISOString()).toBe(dateComponent.toISOString())
    })
  })
})

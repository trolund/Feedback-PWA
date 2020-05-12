/* eslint-disable func-names */
/* eslint-disable no-undef */
import {
  validatePassword,
  validateEmail,
  validatePhone,
  validateStartAndEndDate
} from '../../src/services/validationService'

describe('input validation service', () => {
  describe('test password validation', () => {
    it('should validate the password input', function() {
      const validTestPassword = 'Spinoff1234'
      const invalidTestPassword = 'hej'
      const invalidTestPassTwo = 'j'
      const validTestpassTwo = 'Sa123'

      const valid = validatePassword(validTestPassword)
      const inValid = validatePassword(invalidTestPassword)
      const ValidTwo = validatePassword(validTestpassTwo)
      const inValidTwo = validatePassword(invalidTestPassTwo)

      expect(valid.valid).toBe(true)
      expect(inValid.valid).toBe(false)
      expect(ValidTwo.valid).toBe(true)
      expect(inValidTwo.valid).toBe(false)
    })
  })
  describe('test email validation', () => {
    it('should validate the email input', function() {
      const validTestEmailOne = 'admin@spinoff.com'
      const validTestEmailTwo = 'vadmin@spinoff.dk'
      const validTestEmailThree = 'valid@gmail.com'
      const invalidTestEmailOne = 'hej'
      const invalidTestEmailTwo = 'hej med dig'
      const invalidTestEmailThree = '@hejmeddi.com'

      const valid1 = validateEmail(validTestEmailOne)
      const valid2 = validateEmail(validTestEmailTwo)
      const valid3 = validateEmail(validTestEmailThree)

      const inValid1 = validatePassword(invalidTestEmailOne)
      const inValid2 = validatePassword(invalidTestEmailTwo)
      const inValid3 = validatePassword(invalidTestEmailThree)

      expect(valid1.valid).toBe(true)
      expect(valid2.valid).toBe(true)
      expect(valid3.valid).toBe(true)
      expect(inValid1.valid).toBe(false)
      expect(inValid2.valid).toBe(false)
      expect(inValid3.valid).toBe(false)
    })
  })

  describe('test Phone number validation', () => {
    it('should validate the input is only numbers and min length 5', function() {
      const number = '29456660'
      const notnumber = '1234abc'
      const numberButShort = '1234'

      const valid = validatePhone(number)
      const inValid = validatePhone(notnumber)
      const inValid2 = validatePhone(numberButShort)

      console.log(valid)

      expect(valid.valid).toBe(true)
      expect(inValid.valid).toBe(false)
      expect(inValid2.valid).toBe(false)
    })
  })

  describe('test time input validation', () => {
    it('should validate a two time input where a is before b - positive test', function() {
      const a = new Date()
      const b = new Date()

      // + one hour
      b.setHours(b.getHours() + 1)

      const res = validateStartAndEndDate(a, b).valid

      expect(res).toBe(true)
    })
    it('should validate a two time input where a is before b - positive test', function() {
      const a = new Date()
      const b = new Date()

      // + teen hour
      b.setHours(b.getHours() + 10)

      const res = validateStartAndEndDate(a, b).valid

      expect(res).toBe(true)
    })
    it('should validate a two time input where a is before b - negtiv test', function() {
      const a = new Date()
      const b = new Date()

      // - one hour
      b.setHours(b.getHours() - 1)

      const res = validateStartAndEndDate(a, b).valid

      expect(res).toBe(false)
    })
    it('should validate a two time input where a is before b - positive (min) test', function() {
      const a = new Date()
      const b = new Date()

      // + one hour
      b.setMinutes(b.getMinutes() + 1)

      const res = validateStartAndEndDate(a, b).valid

      expect(res).toBe(true)
    })
    it('should validate a two time input where a is before b - negtiv (min) test', function() {
      const a = new Date()
      const b = new Date()

      // - one min
      b.setMinutes(b.getMinutes() - 1)

      const res = validateStartAndEndDate(a, b).valid

      expect(res).toBe(false)
    })
  })
})

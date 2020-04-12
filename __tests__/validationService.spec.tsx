/* eslint-disable func-names */
/* eslint-disable no-undef */
import { validatePassword } from '../src/services/validationService'

describe('input validation', () => {
  describe('login input', () => {
    it('should validate the input', function() {
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
})

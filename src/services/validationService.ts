/* eslint-disable no-useless-escape */
/* eslint-disable import/prefer-default-export */

// util

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

type validationResult = {
  valid: boolean
  validationErrors: string[]
}

const createResult = (
  rules: boolean[],
  validationErrors: string[]
): validationResult => {
  return {
    valid: rules.every(r => r),
    validationErrors: validationErrors.filter(onlyUnique)
  } as validationResult
}

/* Rules */

export const zeroLengthRule = (
  input: string,
  rules: boolean[],
  validationErrors: string[]
) => {
  const inputLength = input?.length > 0
  if (!inputLength) validationErrors.push('Feltet må ikke være tomt')
  rules.push(inputLength)
}

export const upperCaseRule = (
  input: string,
  rules: boolean[],
  validationErrors: string[]
) => {
  const upperCase = /[A-Z]/.test(input)
  if (!upperCase) validationErrors.push('Skal indeholde storebogstaver')
  rules.push(upperCase)
}

export const lowerCaseRule = (
  input: string,
  rules: boolean[],
  validationErrors: string[]
) => {
  const lowerCase = /[a-z]/.test(input)
  if (!lowerCase) validationErrors.push('Skal indeholde storebogstaver')
  rules.push(lowerCase)
}

export const emailRule = (
  input: string,
  rules: boolean[],
  validationErrors: string[]
) => {
  const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)
  if (!validEmail) validationErrors.push('Ikke valid email')
  rules.push(validEmail)
}

export const minLengthRule = (
  input: string,
  rules: boolean[],
  validationErrors: string[],
  minLength?: number
) => {
  const valid = input?.length >= minLength
  if (!valid)
    validationErrors.push(`Må bestå af minimum ${minLength} karaktere.`)
  rules.push(valid)
}

export const maxLengthRule = (
  input: string,
  rules: boolean[],
  validationErrors: string[],
  maxLength?: number
) => {
  const valid = input?.length <= maxLength
  if (!valid)
    validationErrors.push(`Må bestå af minimum ${maxLength} karaktere.`)
  rules.push(valid)
}

export const numericRule = (
  input: string,
  rules: boolean[],
  validationErrors: string[]
) => {
  const valid = /\d/.test(input)
  if (!valid) validationErrors.push(`Skal minimum have et tal.`)
  rules.push(valid)
}

export const onlyNumericRule = (
  input: string,
  rules: boolean[],
  validationErrors: string[]
) => {
  const valid = /^-{0,1}\d+$/.test(input)
  if (!valid) validationErrors.push(`Må kun bestå af tal`)
  rules.push(valid)
}

export const equalsRule = (
  inputA: string,
  inputB: string,
  rules: boolean[],
  validationErrors: string[]
) => {
  const valid = inputA === inputB
  if (!valid) validationErrors.push(`input skal være ens.`)
  rules.push(valid)
}

export const StartbeforeEndDateRule = (
  inputA: Date,
  inputB: Date,
  rules: boolean[],
  validationErrors: string[]
) => {
  const valid = inputA.getTime() < inputB.getTime()
  if (!valid)
    validationErrors.push(`start tidspunkt skal være før slut tidspunkt.`)
  rules.push(valid)
}

export const validDateRule = (
  input: Date,
  rules: boolean[],
  validationErrors: string[]
) => {
  const valid = input instanceof Date
  if (!valid)
    validationErrors.push(`start tidspunkt skal være før slut tidspunkt.`)
  rules.push(valid)
}

/* Validaters */

export const validateTextInput = (
  input: string,
  maxLength: number,
  allowZero: boolean
): validationResult => {
  const validationErrors: string[] = []
  const rules: boolean[] = []

  if (allowZero) zeroLengthRule(input, rules, validationErrors)
  maxLengthRule(input, rules, validationErrors, maxLength)

  return createResult(rules, validationErrors)
}

export const validateStartAndEndDate = (
  startTime: Date,
  endTime: Date
): validationResult => {
  const validationErrors: string[] = []
  const rules: boolean[] = []

  validDateRule(startTime, rules, validationErrors)
  validDateRule(endTime, rules, validationErrors)
  StartbeforeEndDateRule(startTime, endTime, rules, validationErrors)

  return createResult(rules, validationErrors)
}

export const validateNotEmpty = (input: string): validationResult => {
  const validationErrors: string[] = []
  const rules: boolean[] = []

  minLengthRule(input, rules, validationErrors, 1)

  return createResult(rules, validationErrors)
}

export const validatePhone = (phone: string): validationResult => {
  const validationErrors: string[] = []
  const rules: boolean[] = []

  onlyNumericRule(phone, rules, validationErrors)
  minLengthRule(phone, rules, validationErrors, 8)

  return createResult(rules, validationErrors)
}

export const validateEmail = (mail: string): validationResult => {
  const validationErrors: string[] = []
  const rules: boolean[] = []

  emailRule(mail, rules, validationErrors)
  zeroLengthRule(mail, rules, validationErrors)

  return createResult(rules, validationErrors)
}

export const validatePassword = (password: string): validationResult => {
  const validationErrors: string[] = []
  const rules: boolean[] = []

  zeroLengthRule(password, rules, validationErrors)
  upperCaseRule(password, rules, validationErrors)
  lowerCaseRule(password, rules, validationErrors)
  minLengthRule(password, rules, validationErrors, 4)
  numericRule(password, rules, validationErrors)

  return createResult(rules, validationErrors)
}

export const validateNewPassword = (
  passwordA: string,
  passwordB: string
): validationResult => {
  const validationErrors: string[] = []
  const rules: boolean[] = []

  zeroLengthRule(passwordA, rules, validationErrors)
  upperCaseRule(passwordA, rules, validationErrors)
  lowerCaseRule(passwordA, rules, validationErrors)
  minLengthRule(passwordA, rules, validationErrors, 4)
  numericRule(passwordA, rules, validationErrors)
  equalsRule(passwordA, passwordB, rules, validationErrors)

  return createResult(rules, validationErrors)
}

import QuestionSet from '../models/QuestionSet'

/* eslint-disable import/prefer-default-export */
export const makeid = length => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const filterTempletes = (n: QuestionSet) =>
  n.companyId !== Number(process.env.spinOffCompenyId)
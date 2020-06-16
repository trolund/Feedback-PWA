import IQuestionSet from '../models/QuestionSet'
import IQuestion from '../models/Question'

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

export const filterTempletes = (n: IQuestionSet) =>
  n.companyId !== Number(process.env.spinOffCompenyId)

export const prepareQuestionSetforUpdate = (set: IQuestionSet) => {
  return {
    ...set,
    questions: set.questions.map(i => {
      return i.questionId.length <= 10
        ? ({
            index: i.index,
            questionSetId: i.questionSetId,
            theQuestion: i.theQuestion
          } as IQuestion)
        : i
    })
  } as IQuestionSet
}
// export const copyImg = async src => {
//   const img = await fetch(src)
//   const imgBlob = await img.blob()
//   try {
//     navigator.clipboard.write([
//       new ClipboardItem({
//         'image/png': imgBlob // change image type accordingly
//       })
//     ])
//   } catch (error) {
//     console.error(error)
//   }
// }

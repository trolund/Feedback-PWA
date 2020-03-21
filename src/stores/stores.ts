// import { useStaticRendering } from 'mobx-react'
// import QuestionStore from './QuestionStore'
// import FeedbackStore from './FeedbackStore'
// import {
//   InitialDataFeedback,
//   InitialDataQuestion
// } from './initialDataTypes/initialDataFeedback'
// import states from './requestState'

// const isServer = typeof window === 'undefined'
// useStaticRendering(isServer)

// let store = null

// const initMsg = 'No data yet'
// const initState = states.DONE

// export default function initializeStore(
//   initialData = {
//     feedbackStore: {
//       feedback: [],
//       feedbackBatch: [],
//       msg: initMsg,
//       state: initState
//     } as InitialDataFeedback,
//     questionStore: {
//       questions: {},
//       msg: initMsg,
//       fetchState: initState
//     } as InitialDataQuestion
//   }
// ) {
//   if (isServer) {
//     return {
//       questionStore: new QuestionStore(initialData.questionStore),
//       feedbackStore: new FeedbackStore(initialData.feedbackStore)
//     }
//   }
//   if (store === null) {
//     store = {
//       questionStore: new QuestionStore(initialData.questionStore),
//       feedbackStore: new FeedbackStore(initialData.feedbackStore)
//     }
//   }

//   return store
// }

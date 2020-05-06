import { observer } from 'mobx-react-lite'
import { useEffect, useContext, useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Page from '../../components/page'
import FeedbackViewPager from '../../components/feedback/FeedbackViewPager'
import createFingerprint from '../../services/fingerprintService'
import rootStore from '../../stores/RootStore'
import MiddelLoader from '../../components/middelLoading'
import FetchStates from '../../stores/requestState'

const Feedback: NextPage = observer(() => {
  const router = useRouter()
  const { mid } = router.query
  const {
    questionStore: { fetchQuestions, questions, fetchState }
  } = useContext(rootStore)
  const [statusCode, setStatusCode] = useState(0)
  const [fingerprint, setFingerprint] = useState('')

  useEffect(() => {
    createFingerprint().then(newFingerprint => {
      setFingerprint(newFingerprint)
      fetchQuestions(String(mid), newFingerprint).then(code => {
        console.log(code)

        setStatusCode(code)
      })
    })
  }, [fetchQuestions, mid])

  useEffect(() => {
    console.log(statusCode)
  }, [statusCode])

  return (
    <>
      <MiddelLoader
        loading={fetchState === FetchStates.LOADING}
        text='Forbereder skema'
      />
      <Page showBottomNav={false} showHead={false}>
        {statusCode === 400 && <p>Mødet er lukket</p>}
        {statusCode === 404 && <p>Mødet findes ikke</p>}
        {statusCode === 401 && <p>Man kan kun give feedback en gang</p>}
        {questions !== null && (
          <FeedbackViewPager
            initQuestions={questions}
            mid={String(mid)}
            fingerprint={fingerprint}
          />
        )}
        <style jsx global>{`
          .frame {
            height: 80vh !important;
            padding-bottom: 10px;
          }
        `}</style>
        <style jsx>{`
          .controller-container {
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
          }

          .pager-controls {
            padding: 30px;
            position: fixed;
            bottom: 0px;
            left: 0px;
            right: 0px;
            width: 100%;
          }
          .pager-control {
            text-align: center;
            width: 120px;
          }
          .main {
            width: 100%;
            height: 100%;
          }
        `}</style>
      </Page>
    </>
  )
})

// Feedback.getInitialProps = async ctx => {
//   const { query } = ctx
//   const { fingerprint } = cookies(ctx)
//   const { mid } = query

//   let statusCode = 0
//   const url = ApiRoutes.FetchQuestions(String(mid))
//   let data: QuestionSet[] | null = null
//   const options = {
//     agent: new https.Agent({
//       // TODO fix for production with real SSL CERT
//       rejectUnauthorized: false
//     })
//   }

//   if (fingerprint !== undefined) {
//     try {
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         ...options,
//         body: JSON.stringify(fingerprint)
//       })
//       statusCode = response.status
//       if (response.status === 200) {
//         data = await response.json()
//       }
//       console.log(response)
//     } catch (e) {
//       console.error(e)
//       statusCode = 500
//     }
//   } else {
//     statusCode = 1000 // fingerprint not found
//   }
//   return {
//     initQuestions: data,
//     statusCode
//   }
// }

export default Feedback

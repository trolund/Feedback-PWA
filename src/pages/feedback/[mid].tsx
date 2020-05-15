import { observer } from 'mobx-react-lite'
import { useEffect, useContext, useState } from 'react'
import { NextPage } from 'next'
import Router, { useRouter } from 'next/router'
import { Lock, Compass, Send, ChevronLeft } from 'react-feather'
import Page from '../../components/essentials/page'
import FeedbackViewPager from '../../components/feedback/FeedbackViewPager'
import createFingerprint from '../../services/fingerprintService'
import rootStore from '../../stores/RootStore'
import MiddelLoader from '../../components/essentials/middelLoading'
import FetchStates from '../../stores/requestState'
import Section from '../../components/essentials/section'
import { logEvent } from '../../utils/analytics'

const Feedback: NextPage = observer(() => {
  const router = useRouter()
  const { mid } = router.query
  const {
    questionStore: { fetchQuestions, questions, fetchState },
    authStore: { getUser }
  } = useContext(rootStore)
  const [statusCode, setStatusCode] = useState(0)
  const [fingerprint, setFingerprint] = useState('')

  useEffect(() => {
    if (mid !== undefined) {
      createFingerprint()
        .then(newFingerprint => {
          setFingerprint(newFingerprint)
          logEvent(
            'fingerprint',
            'fingerprint-creation-success',
            0,
            `${newFingerprint} ${getUser().id}`
          )
          fetchQuestions(String(mid), newFingerprint).then(code => {
            setStatusCode(code)
            logEvent(
              'fingerprint',
              'fingerprint-fetchQuestionss',
              0,
              `${newFingerprint} ${getUser().id} ${String(mid)}`
            )
          })
        })
        .catch(e =>
          logEvent(
            'fingerprint',
            'fingerprint-creation-error',
            0,
            JSON.stringify(e)
          )
        )
    }
  }, [fetchQuestions, getUser, mid])

  useEffect(() => {
    logEvent('Feedback side', String(statusCode))
  }, [statusCode])

  const BackBtn = () => (
    <button
      type='button'
      style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
        marginTop: '20vh'
      }}
      className='button'
      onClick={() => Router.back()}
    >
      <ChevronLeft
        style={{
          marginBottom: '-5px',
          marginRight: '5px',
          height: '20px',
          width: '20px'
        }}
      />{' '}
      Tilbage
    </button>
  )

  return (
    <>
      <MiddelLoader
        loading={fetchState === FetchStates.LOADING}
        text='Tilbagemelding er anonym'
      />
      <Page showBottomNav={false} showHead={false} fullscreen>
        <Section>
          {statusCode === 400 && fetchState === FetchStates.DONE && (
            <div className='msg-container'>
              <Lock
                style={{
                  width: '80px',
                  height: '80px',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
              />
              <p className='msg'>
                Mødet er ikke åben for Tilbagemeldinger på dette tidspunkt.
              </p>
              <BackBtn />
            </div>
          )}
          {statusCode === 404 && fetchState === FetchStates.DONE && (
            <div className='msg-container'>
              <Compass
                style={{
                  width: '80px',
                  height: '80px',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
              />
              <p className='msg'>Mødet blev ikke fundet.</p>
            </div>
          )}
          {statusCode === 401 && fetchState === FetchStates.DONE && (
            <div className='msg-container'>
              <Send
                style={{
                  width: '80px',
                  height: '80px',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
              />
              <p className='msg'>Man kan kun give feedback en gang</p>
            </div>
          )}
          {questions !== null && (
            <FeedbackViewPager
              initQuestions={questions}
              mid={String(mid)}
              fingerprint={fingerprint}
            />
          )}
        </Section>
        <style jsx global>{`
          .frame {
            height: 75vh !important;
            padding-bottom: 10px;
            outline: none;
          }
        `}</style>
        <style jsx>{`
          .msg-container {
            text-align: center;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 680px;
            max-height: 300px;
          }

          .msg {
            text-align: center;
            margin-left: auto;
            margin-right: auto;
          }

          .controller-container {
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
          }

          .pager-controls {
            padding: 30px;
            position: fixed;
            height: 50px;
            bottom: env(safe-area-inset-bottom, 20px);
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

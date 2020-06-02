import { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { observer } from 'mobx-react-lite'
import { Hash, LogIn, Maximize, Smile, AlertCircle } from 'react-feather'
import Lottie from 'react-lottie'
import Prompt from '../components/essentials/AddToHomescreenPrompt'
import Page from '../components/essentials/page'
import Section from '../components/essentials/section'
import * as loading from '../../public/Animations/loading.json'
import FetchStates from '../stores/requestState'
import CustomInput from '../components/Input/custom-input'
import rootStore from '../stores/RootStore'
import withRedirect from '../components/hoc/withRedirect'
import { logLaunched } from '../utils/loggingHelprer'
import { getIOSVersion } from '../services/deviceInfoService'
import { logEvent } from '../utils/analytics'

export default withRedirect(
  observer(() => {
    const {
      questionStore: { isMeetingOpen, fetchState }
    } = useContext(rootStore)
    const [errorMsg, setErrorMsg] = useState('')
    const [meetingId, setMeetingId] = useState('')

    // log Launched mode
    useEffect(() => {
      window.addEventListener('load', logLaunched)
      return () => {
        window.removeEventListener('load', logLaunched)
      }
    }, [])

    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: (loading as any).default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    }

    const checkMeetingClickHandler = () => {
      setErrorMsg('')
      isMeetingOpen(meetingId).then((result: boolean) => {
        if (result) {
          logEvent('Meeting open', 'send to feedback')
          Router.push(`/feedback/${meetingId}`)
        } else {
          setErrorMsg('Dette er ikke et gyldigt ID')
          logEvent('Meeting open', 'error')
        }
      })
    }

    return (
      <Page
        showBottomNav={false}
        showHead={false}
        showBackButton={false}
        bgColor='rgba(0,0,0,0)'
        fullscreen
      >
        <Section>
          <div className='container'>
            <div className='logo' />
            <CustomInput
              error={errorMsg.length > 0}
              className='meeting-id-input center'
              type='text'
              placeholder='Indtast møde ID'
              value={meetingId}
              onChange={e => setMeetingId(e)}
              logo={
                fetchState === FetchStates.LOADING ? (
                  <div style={{ marginTop: '-7px', marginLeft: '-7px' }}>
                    <Lottie options={defaultOptions} height={35} width={35} />
                  </div>
                ) : (
                  // <Loader />
                  <Hash
                    style={{ width: '20px', height: '20px' }}
                    color='white'
                  />
                )
              }
              center
            />
            <p className='msg'>
              {errorMsg && (
                <AlertCircle
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '10px',
                    marginTop: '2px;'
                  }}
                  color='white'
                />
              )}
              {errorMsg ?? ''}
            </p>
            <div className='center buttons'>
              <button
                title='login'
                aria-label='login'
                onClick={checkMeetingClickHandler}
                onKeyDown={checkMeetingClickHandler}
                type='button'
                tabIndex={0}
                className='center button'
              >
                <Smile
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '-20px',
                    float: 'left'
                  }}
                  color='white'
                />
                Giv Feedback
              </button>
              {(getIOSVersion() >= 13 || getIOSVersion() === undefined) && (
                <Link href='/scanner' key='scanner'>
                  <button
                    title='scanner'
                    type='button'
                    aria-label='scanner'
                    className='center button loginBtn'
                  >
                    <Maximize
                      style={{
                        width: '20px',
                        height: '20px',
                        marginRight: '-20px',
                        float: 'left'
                      }}
                      color='white'
                    />
                    Scan kode
                  </button>
                </Link>
              )}
              <hr />
              <Link href='/login' key='login'>
                <button
                  title='login'
                  type='button'
                  aria-label='login'
                  className='center button loginBtn'
                >
                  <LogIn
                    style={{
                      width: '20px',
                      height: '20px',
                      marginRight: '-20px',
                      float: 'left'
                    }}
                    color='white'
                  />
                  Login
                </button>
              </Link>
            </div>
          </div>
          {/* <div>
            <p>Spinoff</p>
          </div> */}
        </Section>
        <style jsx>{`
          hr {
            opacity: 0.2;
            border: solid whitesmoke 0.5px;
            max-width: calc(260px / 2);
            margin-left: auto;
            margin-right: auto;
          }
          .msg {
            text-align: center !important;
            height: 8vh;
            padding: 2vh;
            color: whitesmoke;
          }
          input {
            margin-left: auto;
            margin-right: auto;
          }
          .meeting-id-input {
            text-align: center;
          }

          .buttons {
             {
              /* padding-top: 20px;
          padding-bottom: 20px; */
            }
          }

          .buttons button {
            width: 80vw;
            max-width: 260px;
          }
          .loginBtn {
            margin-top: 4vh;
          }
          .button {
            display: table;
          }
          .logo {
            background-image: url('/images/logo.png');
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
            height: 100px;
            width: 230px;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 20px;
          }

          .container {
            background: var(--backdrop);
            height: fit-content;
            width: fit-content;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
            padding: var(--gap);
            margin: auto;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 2px 6px 16px -6px rgba(0, 0, 0, 0.25);
            border-radius: var(--border-radius);
          }
        `}</style>

        <style jsx global>{`
          body {
            background: var(--gradiant);
          }
        `}</style>
        <Prompt />
      </Page>
    )
  })
)

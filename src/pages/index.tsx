import { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { observer } from 'mobx-react-lite'
import { Hash, LogIn, Maximize, Smile, AlertCircle } from 'react-feather'
import Lottie from 'react-lottie'
import Page from '../components/essentials/page'
import Section from '../components/essentials/section'
import * as loading from '../../public/Animations/loading.json'
import FetchStates from '../stores/requestState'
import CustomInput from '../components/Input/custom-input'
import rootStore from '../stores/RootStore'
import withRedirect from '../components/hoc/withRedirect'
import { logLaunched } from '../utils/loggingHelprer'

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
          Router.push(`/feedback/${meetingId}`)
        } else {
          setErrorMsg('Noget gik galt')
        }
      })
    }

    return (
      <Page
        showBottomNav={false}
        showHead={false}
        showBackButton={false}
        bgColor='darkslategrey'
        fullscreen
      >
        <Section>
          <div className='logo' style={{ marginTop: '10vh' }} />
          <CustomInput
            error={errorMsg.length > 0}
            className='meeting-id-input center'
            type='text'
            placeholder='Møde ID'
            value={meetingId}
            onChange={e => setMeetingId(e)}
            logo={
              fetchState === FetchStates.LOADING ? (
                <div style={{ marginTop: '-7px', marginLeft: '-7px' }}>
                  <Lottie options={defaultOptions} height={35} width={35} />
                </div>
              ) : (
                // <Loader />
                <Hash style={{ width: '20px', height: '20px' }} color='white' />
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
            background-size: contain;
            background-repeat: no-repeat;
            height: 100px;
            width: 230px;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 20px;
          }
        `}</style>
      </Page>
    )
  })
)

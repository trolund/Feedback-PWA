import { useContext, useState } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { observer } from 'mobx-react-lite'
import { Hash } from 'react-feather'
// import PWAPrompt from 'react-ios-pwa-prompt'
import Lottie from 'react-lottie'
import Page from '../components/page'
import Section from '../components/section'
import questionStore from '../stores/QuestionStore'
import * as loading from '../../public/Animations/loading.json'
import FetchStates from '../stores/requestState'
import Prompt from '../components/AddToHomescreenPrompt'
import CustomInput from '../components/custom-input'
// import states from '../stores/requestState'

export default observer(() => {
  const { isMeetingOpen, fetchState } = useContext(questionStore)
  const [errorMsg, setErrorMsg] = useState('')
  const [meetingId, setMeetingId] = useState('')

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: (loading as any).default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  const checkMeetingClickHandler = () => {
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
    >
      <Section>
        <div className='logo' />
        <CustomInput
          className='meeting-id-input center'
          type='text'
          placeholder='Møde ID'
          value={meetingId}
          onChange={e => setMeetingId(e)}
          logo={<Hash style={{ width: '20px', height: '20px' }} />}
          center
        />
        <p className='msg'>{errorMsg ?? ''}</p>
        <div className='center buttons'>
          <a
            title='login'
            aria-label='login'
            onClick={checkMeetingClickHandler}
            onKeyDown={checkMeetingClickHandler}
            role='button'
            tabIndex={0}
            className='center button'
          >
            {fetchState === FetchStates.LOADING && (
              <Lottie options={defaultOptions} height={25} width={25} />
              // <Loader />
            )}
            Giv Feedback
          </a>
          <Link href='/scanner' key='scanner'>
            <a
              title='scanner'
              aria-label='scanner'
              className='center button loginBtn'
            >
              Scan meeting code
            </a>
          </Link>
          <Link href='/login' key='login'>
            <a
              title='login'
              aria-label='login'
              className='center button loginBtn'
            >
              login
            </a>
          </Link>
        </div>
      </Section>
      <style jsx>{`
        .msg {
          text-align: center !important;
        }
        input {
          margin-left: auto;
          margin-right: auto;
        }
        .meeting-id-input {
          text-align: center;
        }
        .buttons {
          padding-top: 20px;
          padding-bottom: 20px;
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
      <Prompt />
    </Page>
  )
})

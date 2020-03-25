import { useContext, useState } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import Page from '../components/page'
import Section from '../components/section'
import questionStore from '../stores/QuestionStore'
import states from '../stores/requestState'

export default () => {
  const { fetchQuestions } = useContext(questionStore)
  const [errorMsg, setErrorMsg] = useState(null)
  const [meetingId, setMeetingId] = useState(null)

  const checkMeetingClickHandler = () => {
    fetchQuestions(meetingId).then((result: states) => {
      if (result === states.DONE) {
        Router.push('/survage')
      } else {
        setErrorMsg('Noget gik galt')
      }
    })
  }

  return (
    <Page showBottomNav={false} showHead={false} showBackButton={false}>
      <Section>
        <div className='logo' />
        <input
          className='meeting-id-input'
          type='text'
          placeholder='Møde ID'
          onChange={e => setMeetingId(e.target.value)}
        />
        {errorMsg !== null && <p>{errorMsg}</p>}
        <div className='center buttons'>
          <Link href='/#' key='#'>
            <a
              title='login'
              aria-label='login'
              onClick={checkMeetingClickHandler}
              onKeyDown={checkMeetingClickHandler}
              role='button'
              tabIndex={0}
              className='center button'
            >
              Giv Feedback
            </a>
          </Link>
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
        .meeting-id-input {
          text-align: center;
        }
        .buttons {
          padding-top: 20px;
          padding-bottom: 20px;
        }
        .loginBtn {
          margin-top: 50px;
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
}

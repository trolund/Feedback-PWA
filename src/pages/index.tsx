import { useContext, useState } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import Page from '../components/page'
import Section from '../components/section'
import questionStore from '../stores/QuestionStore'
import states from '../stores/requestState'

export default () => {
  const { fetchQuestions, fetchState: state } = useContext(questionStore)
  const [meetingId, setMeetingId] = useState(null)

  const checkMeetingClickHandler = () => {
    fetchQuestions(meetingId).then(() => {
      if (state === states.DONE) Router.push('/survage')
    })
  }

  return (
    <Page showBottomNav={false} showHead={false}>
      <Section>
        <div className='logo' />
        <input
          type='text'
          placeholder='møde id'
          onChange={e => setMeetingId(e.target.value)}
        />
        <Link href='/login' key='login'>
          <a
            title='login'
            aria-label='login'
            onClick={checkMeetingClickHandler}
            onKeyDown={checkMeetingClickHandler}
            role='button'
            tabIndex={0}
          >
            Giv Feedback
          </a>
        </Link>
        <Link href='/login' key='login'>
          <a title='login' aria-label='login'>
            login
          </a>
        </Link>
      </Section>

      <style jsx>{`
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

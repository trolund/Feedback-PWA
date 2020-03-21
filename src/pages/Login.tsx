import { useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import Page from '../components/page'
import Section from '../components/section'

export default () => {
  const [rememberme, setRememberme] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const loginHandler = () => {
    console.log('home')
    Router.push('/Home')
  }

  return (
    <Page showHead={false} showBottomNav={false} showBackButton>
      <Section>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <input
          type='text'
          placeholder='Email'
          value={username}
          onChange={e => {
            setUsername(e.target.value)
          }}
        />
        <input
          type='password'
          placeholder='Kodeord'
          value={password}
          onChange={e => {
            setPassword(e.target.value)
          }}
        />
        <div>
          <label htmlFor='rememberme' className='container'>
            Remember me
            <input
              type='checkbox'
              onClick={() => setRememberme(!rememberme)}
              checked={rememberme}
            />
            <span className='checkmark' />
          </label>
        </div>

        <Link href='#'>
          <a
            tabIndex={0}
            role='button'
            title='login'
            aria-label='login'
            onKeyDown={loginHandler}
            onClick={loginHandler}
            className='button loginBtn'
          >
            login
          </a>
        </Link>
      </Section>

      <style jsx>{`
        .loginBtn {
          margin-top: 50px;
        }
        .button {
          display: table;
        }
        input {
          margin-top: 20px;
        }

        a {
          margin-left: auto;
          margin-right: auto;
        }
        .container {
          display: block;
          position: relative;
          padding-left: 35px;
          margin-bottom: 12px;
          cursor: pointer;
          font-size: 22px;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Hide the browser's default checkbox */
        .container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        /* Create a custom checkbox */
        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 25px;
          width: 25px;
          background-color: #eee;
          border-radius: 5px;
        }

        /* On mouse-over, add a grey background color */
        .container:hover input ~ .checkmark {
          background-color: #ccc;
        }

        /* When the checkbox is checked, add a blue background */
        .container input:checked ~ .checkmark {
          background-color: var(--accent);
        }

        /* Create the checkmark/indicator (hidden when not checked) */
        .checkmark:after {
          content: '';
          position: absolute;
          display: none;
        }

        /* Show the checkmark when checked */
        .container input:checked ~ .checkmark:after {
          display: block;
        }

        /* Style the checkmark/indicator */
        .container .checkmark:after {
          left: 9px;
          top: 5px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 3px 3px 0;
          -webkit-transform: rotate(45deg);
          -ms-transform: rotate(45deg);
          transform: rotate(45deg);
        }
      `}</style>
    </Page>
  )
}

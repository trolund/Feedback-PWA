/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { CheckCircle } from 'react-feather'
import Link from 'next/link'
import { NextPage } from 'next'
import Page from '../components/page'
import Section from '../components/section'
import authStore from '../stores/authStore'
import FetchStates from '../stores/requestState'
import CustomCheckbox from '../components/checkbox'
import { validateEmail, validatePassword } from '../services/validationService'

const Login: NextPage = observer(() => {
  const [rememberme, setRememberme] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginBtnDisabled, setLoginBtnDisabled] = useState(true)
  const { login, state, msg } = useContext(authStore)
  const [inputFeedback, setinputFeedback] = useState([] as string[])

  const loginHandler = (event: any) => {
    const email = validateEmail(username)
    const pass = validatePassword(password)
    if (email.valid && pass.valid) {
      login(username, password, rememberme)
    } else {
      setinputFeedback([...email.validationErrors, ...pass.validationErrors])
    }
    event.preventDefault() // prevent a browser reload/refresh
  }

  useEffect(() => {
    setLoginBtnDisabled(
      !validatePassword(password) && !validatePassword(password)
    )
  }, [password, password.length, username.length])

  return (
    <Page showBottomNav={false} showBackButton title='login'>
      <Section>
        <form onSubmit={loginHandler}>
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
          <div className='center' style={{ width: '200px', marginTop: '25px' }}>
            <CustomCheckbox
              label='Remember me'
              checked
              onChange={checked => setRememberme(checked)}
            />
          </div>

          {state === FetchStates.LOADING && (
            <p className='center msg'>Loading</p>
          )}
          {state === FetchStates.FAILED && <p className='center msg'>{msg}</p>}
          {state === FetchStates.DONE && msg.length > 0 && (
            <p className='center msg'>
              <CheckCircle
                style={{ width: '20px', height: '20px', marginRight: '10px' }}
              />
              {msg}
            </p>
          )}
          {inputFeedback.length > 0 && (
            <ul style={{ color: 'red' }} className='center msg'>
              {inputFeedback.map(error => (
                <li>{error}</li>
              ))}
            </ul>
          )}
          <button
            type='submit'
            aria-label='login'
            className='button loginBtn center'
            disabled={loginBtnDisabled}
          >
            login
          </button>
        </form>
        <Link href='/registration'>
          <a
            tabIndex={0}
            role='button'
            title='new user'
            aria-label='login'
            className='button loginBtn'
          >
            Opret bruger
          </a>
        </Link>
      </Section>

      <style jsx global>{`
        .loginBtn {
          margin-top: 50px;
        }
        .button {
          display: table;
        }
        input {
          margin-top: 20px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        a {
          margin-left: auto;
          margin-right: auto;
        }

        .msg {
          text-align: center !important;
        }

        main {
          background-color: darkslategrey !important;
        }
      `}</style>
    </Page>
  )
})

// Login.getInitialProps = async ctx => {
//   const token = auth(ctx)

//   if (ctx.res && tokenValid(token)) {
//     ctx.res.writeHead(302, { Location: '/home' })
//     ctx.res.end()
//   }

//   return {
//     token
//   }
// }

export default Login

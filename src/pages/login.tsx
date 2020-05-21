/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { CheckCircle, User, Key, LogIn, UserPlus } from 'react-feather'
import Link from 'next/link'
import { NextPage } from 'next'
import Page from '../components/essentials/page'
import Section from '../components/essentials/section'
import FetchStates from '../stores/requestState'
import CustomCheckbox from '../components/Input/checkbox'
import { validateEmail, validatePassword } from '../services/validationService'
import CustomInput from '../components/Input/custom-input'
import rootStore from '../stores/RootStore'
import withRedirect from '../components/hoc/withRedirect'

const Login: NextPage = withRedirect(
  observer(() => {
    const [rememberme, setRememberme] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loginBtnDisabled, setLoginBtnDisabled] = useState(true)
    const {
      authStore: { login, state, msg }
    } = useContext(rootStore)
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
            <CustomInput
              id='email'
              logo={<User color='white' />}
              className='center'
              type='text'
              placeholder='Email'
              value={username}
              onChange={e => {
                setUsername(e)
              }}
            />
            <CustomInput
              id='password'
              logo={<Key color='white' />}
              className='center'
              type='password'
              placeholder='Kodeord'
              value={password}
              onChange={e => {
                setPassword(e)
              }}
            />
            <div
              className='center'
              style={{ width: '200px', marginTop: '25px' }}
            >
              <CustomCheckbox
                label='Forbliv logget ind'
                checked
                onChange={checked => setRememberme(checked)}
              />
            </div>
            <div
              className='center'
              style={{ textAlign: 'center', padding: '15px' }}
            >
              <Link href='/password-reset'>
                <a>Glemt dit kodeord?</a>
              </Link>
            </div>
            {state === FetchStates.LOADING && (
              <p className='center msg'>Loading</p>
            )}
            {state === FetchStates.FAILED && (
              <p className='center msg'>{msg}</p>
            )}
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
              id='submit'
              type='submit'
              aria-label='login'
              className='button loginBtn center'
              disabled={loginBtnDisabled}
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
              login
            </button>
          </form>
          <hr />
          <Link href='/registration'>
            <button
              tabIndex={0}
              type='button'
              title='new user'
              aria-label='login'
              className='button loginBtn'
            >
              <UserPlus
                style={{
                  width: '20px',
                  height: '20px',
                  marginRight: '-20px',
                  float: 'left'
                }}
                color='white'
              />
              Opret bruger
            </button>
          </Link>
        </Section>

        <style jsx global>{`
          hr {
            opacity: 0.2;
            border: solid 0.5px;
            max-width: calc(260px / 2);
            margin-left: auto;
            margin-right: auto;
          }
          button {
            margin-left: auto;
            margin-right: auto;
            width: 80vw;
            max-width: 260px;
          }
          .loginBtn {
            margin-top: 4vh;
          }
          .button {
            display: table;
          }
          input {
            text-align: center;
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
        `}</style>
      </Page>
    )
  })
)

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

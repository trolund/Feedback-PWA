/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useContext, useEffect } from 'react'
import Router from 'next/router'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import cookies from 'next-cookies'
import { NextPage } from 'next'
import Page from '../components/page'
import Section from '../components/section'
import authStore from '../stores/authStore'
import states from '../stores/requestState'
import CustomCheckbox from '../components/checkbox'
import AuthService from '../services/authService'

const Login: NextPage = observer(() => {
  const [rememberme, setRememberme] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginBtnDisabled, setLoginBtnDisabled] = useState(true)
  const { login, state, msg } = useContext(authStore)

  const loginHandler = () => {
    login(username, password, rememberme).then(res => {
      if (res === states.DONE) {
        Router.push('/Home')
      }
    })
  }

  // useEffect(() => {
  //   AuthService.redirectToHome()
  // }, [])

  useEffect(() => {
    setLoginBtnDisabled(!(username.length > 0 && password.length > 0))
  }, [password.length, username.length])

  return (
    <Page showBottomNav={false} showBackButton title='login'>
      <Section>
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

        {state === states.LOADING && <p className='center msg'>Loading</p>}
        {state === states.FAILED && <p className='center msg'>{msg}</p>}
        <button
          tabIndex={0}
          type='button'
          title='login'
          aria-label='login'
          onKeyDown={loginHandler}
          onClick={loginHandler}
          className='button loginBtn center'
          disabled={loginBtnDisabled}
        >
          login
        </button>
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

Login.getInitialProps = async ctx => {
  const { jwttoken } = cookies(ctx)

  if (ctx.res && AuthService.tokenValid(jwttoken)) {
    ctx.res.writeHead(302, { Location: '/home' })
    ctx.res.end()
  }
  return {}
}

export default Login

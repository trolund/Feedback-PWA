import { useState, useContext } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import Page from '../components/page'
import Section from '../components/section'
import authStore from '../stores/authStore'

export default () => {
  const [rememberme, setRememberme] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(authStore)

  const loginHandler = () => {
    login(username, password).then(res => {
      console.log(res)
      Router.push('/Home')
    })
  }

  // useEffect(() => {
  //   AuthService.redirectToLogin()
  // }, [])

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
        <li>
          <p>Checkbox</p>
          <input
            className='styled-checkbox'
            id='styled-checkbox-1'
            type='checkbox'
            checked={rememberme}
            onChange={e =>
              setRememberme(Boolean(e.target.getAttribute('checked')))
            }
            name='styled-checkbox-1'
          />
        </li>
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
      `}</style>
    </Page>
  )
}

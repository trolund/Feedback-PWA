import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { NextPageContext } from 'next'
import Router from 'next/router'
import Page from '../../components/page'
import Section from '../../components/section'
import ApiRoutes from '../../stores/api/ApiRoutes'
import NewPasswordModel from '../../models/NewPasswordModel'
import * as mail from '../../../public/Animations/mail.json'
import * as success from '../../../public/Animations/success.json'
import AnimationOverlay from '../../components/animation-overlay'
import { validateNewPassword } from '../../services/validationService'

type initprops = {
  resettoken?: string
  initEmail?: string
}

const ResetPassword = observer(({ initEmail, resettoken }: initprops) => {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordAgain, setNewPasswordAgain] = useState('')
  const [msg, setMsg] = useState('')
  const [showOverlay, setShowOverlay] = useState(false)
  const [showRestOverlay, setShowORestverlay] = useState(false)
  const [errors, setErrors] = useState([] as string[])

  const getResetTokenEventHandler = async (e: any) => {
    e.preventDefault()
    const url = new URL(ApiRoutes.requestPasswordReset)
    url.search = new URLSearchParams({
      email
    }).toString()

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    if (response.ok) {
      setMsg('Email Send')
      setShowOverlay(true)
    } else {
      setMsg('Der skete en fejl')
      setShowOverlay(false)
    }
  }

  const getResetPasswordEventHandler = async (e: any) => {
    e.preventDefault()
    const validationres = validateNewPassword(newPassword, newPasswordAgain)
    setErrors(validationres.validationErrors)
    if (validationres.valid) {
      const url = new URL(ApiRoutes.confirmPasswordReset)
      const newPasswordModel: NewPasswordModel = {
        email: initEmail,
        newPassword,
        newPasswordAgain,
        token: resettoken
      }
      const body = JSON.stringify(newPasswordModel)
      const response = await fetch(url.toString(), {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' }
      })
      if (response.ok) {
        setMsg('Kodeord er nu nulstilet.')
        setShowORestverlay(true)
      } else {
        setMsg('Der skete en fejl')
      }
    } else {
      setMsg('Kodeord opfylder ikke følgende regler')
    }
  }

  const onAnimationCompleteHandler = () => {
    Router.push('/')
  }

  return (
    <Page title='Password reset'>
      <Section>
        {(initEmail.length === 0 || resettoken.length === 0) && (
          <form onSubmit={getResetTokenEventHandler}>
            <input
              type='text'
              name='email'
              id='email'
              placeholder='Email tilknyttet din konto'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {msg.length > 0 && <p>{msg}</p>}
            <button type='submit' className='button'>
              Send password reset forspørgsel
            </button>
          </form>
        )}
        {initEmail.length > 0 && resettoken.length > 0 && (
          <form onSubmit={getResetPasswordEventHandler}>
            <input
              type='password'
              name='oldPassword'
              id='oldPassword'
              placeholder='nyt kodeord'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <input
              type='password'
              name='oldPasswordAgain'
              id='oldPasswordAgain'
              placeholder='Nyt kodeord igen'
              value={newPasswordAgain}
              onChange={e => setNewPasswordAgain(e.target.value)}
            />
            {msg.length > 0 && <p>{msg}</p>}
            {errors.length > 0 && (
              <ul>
                {errors.map(e => (
                  <li>{e}</li>
                ))}
              </ul>
            )}
            <button type='submit' className='button'>
              Reset kodeord
            </button>
          </form>
        )}
      </Section>
      {showOverlay && (
        <AnimationOverlay
          text={msg}
          animation={mail}
          onComplete={onAnimationCompleteHandler}
        />
      )}
      {showRestOverlay && (
        <AnimationOverlay
          text={msg}
          animation={success}
          onComplete={onAnimationCompleteHandler}
        />
      )}

      <style jsx>{`
        form {
          margin-left: auto;
          margin-right: auto;
        }

        form input {
          margin-bottom: 20px;
        }

        form ul li {
          padding: 10px;
          color: red;
        }

        form input,
        button,
        p,
        ul {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
          display: block;
        }
      `}</style>
    </Page>
  )
})

export async function getServerSideProps(ctx: NextPageContext) {
  const { query } = ctx
  const { resettoken, email } = query
  return {
    props: {
      initEmail: email === undefined ? '' : String(email),
      resettoken: resettoken === undefined ? '' : String(resettoken)
    } as initprops
  }
}

export default ResetPassword

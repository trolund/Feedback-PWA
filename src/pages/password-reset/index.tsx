import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { NextPageContext } from 'next'
import Page from '../../components/page'
import Section from '../../components/section'
import ApiRoutes from '../../stores/api/ApiRoutes'
import NewPasswordModel from '../../models/NewPasswordModel'

type initprops = {
  resettoken?: string
  initEmail?: string
}

const ResetPassword = observer(({ initEmail, resettoken }: initprops) => {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordAgain, setNewPasswordAgain] = useState('')
  const [msg, setMsg] = useState('')

  console.log('====================================')
  console.log(initEmail.length)
  console.log('====================================')

  const getResetTokenEventHandler = async (e: any) => {
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
    } else {
      setMsg('Der skete en fejl')
    }
    e.defaultPrevented()
  }

  const getResetPasswordEventHandler = async (e: any) => {
    const url = new URL(ApiRoutes.confirmPasswordReset)
    const newPasswordModel: NewPasswordModel = {
      email,
      newPassword,
      newPasswordAgain,
      token: resettoken
    }
    const body = JSON.stringify(newPasswordModel)
    const response = await fetch(url.toString(), { method: 'POST', body })
    if (response.ok) {
      setMsg('Kodeord er nu nulstilet.')
    } else {
      setMsg('Der skete en fejl')
    }
    e.defaultPrevented()
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
            <button type='submit'>Send password reset forspørgsel</button>
          </form>
        )}
        {initEmail.length > 0 && resettoken.length > 0 && (
          <form onSubmit={getResetPasswordEventHandler}>
            <input
              type='password'
              name='oldPassword'
              id='oldPassword'
              placeholder='OldPassword'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <input
              type='password'
              name='oldPasswordAgain'
              id='oldPasswordAgain'
              placeholder='OldPasswordAgain'
              value={newPasswordAgain}
              onChange={e => setNewPasswordAgain(e.target.value)}
            />
            {msg.length > 0 && <p>{msg}</p>}
            <button type='submit'>Reset kodeord</button>
          </form>
        )}
      </Section>

      <style jsx>{`
        form {
          margin-left: auto;
          margin-right: auto;
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

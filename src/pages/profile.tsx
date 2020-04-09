import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Settings } from 'react-feather'
import Router from 'next/router'
import Page from '../components/page'
import Section from '../components/section'
import authStore from '../stores/authStore'
import ThemeButton from '../components/theme-button'
import authService from '../services/authService'
import User from '../models/User'

const Profile = observer(() => {
  const { getUser, signout } = useContext(authStore)

  const SettingsBtn = () => {
    return <Settings onClick={() => Router.push('/settings')} />
  }
  let user: User = { companyId: 0, firstname: '?', lastname: '?', roles: [] }
  if (typeof window !== 'undefined') user = getUser()
  return (
    <Page title='Profile' component={<SettingsBtn />}>
      <Section>
        <h2>Profile</h2>
        <input placeholder='Firstname' value={user.firstname} />
        <input placeholder='Lastname' value={user.lastname} />
        <input placeholder='Firstname' value={user.companyId} />
        <input placeholder='Firstname' value={user.roles} />
        <ThemeButton />
        <button
          type='button'
          className='button'
          onClick={() => {
            signout()
            Router.push('/')
          }}
        >
          Logout
        </button>
      </Section>
    </Page>
  )
})

export default Profile

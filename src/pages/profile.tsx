import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Settings } from 'react-feather'
import Router from 'next/router'
import Page from '../components/page'
import Section from '../components/section'
import authStore from '../stores/authStore'
import ThemeButton from '../components/theme-button'
import authService from '../stores/api/authService'

const Profile = observer(() => {
  const { getUser } = useContext(authStore)

  const SettingsBtn = () => {
    return <Settings onClick={() => Router.push('/settings')} />
  }

  const user = getUser()
  return (
    <Page title='Profile' component={<SettingsBtn />}>
      <Section>
        <h2>Profile</h2>
        <input placeholder='Firstname' value={user.firstname} />
        <input placeholder='Lastname' value={user.lastname} />
        <input placeholder='Firstname' value={user.companyId} />
        <input placeholder='Firstname' value={user.roles} />
        <button type='button' className='button'>
          Logout
        </button>
        <ThemeButton />
        <button
          type='button'
          className='button'
          onClick={() => authService.logout()}
        >
          Logout
        </button>
      </Section>
    </Page>
  )
})

export default Profile

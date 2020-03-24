import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import Page from '../components/page'
import Section from '../components/section'
import authStore from '../stores/authStore'

const Profile = observer(() => {
  const { getUser } = useContext(authStore)
  const user = getUser()
  return (
    <Page title='Profile'>
      <Section>
        <h2>Profile</h2>
        <input placeholder='Firstname' value={user.firstname} />
        <input placeholder='Lastname' value={user.lastname} />
        <input placeholder='Firstname' value={user.companyId} />
        <input placeholder='Firstname' value={user.roles} />
        <button type='button' className='button'>
          Logout
        </button>
      </Section>
    </Page>
  )
})

export default Profile

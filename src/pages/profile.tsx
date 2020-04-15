import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Settings, LogOut } from 'react-feather'
import Router from 'next/router'
import Page from '../components/page'
import Section from '../components/section'
import authStore from '../stores/authStore'
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
        <ul>
          <li>
            <input
              type='text'
              className='info'
              placeholder='Firstname'
              value={user.firstname}
            />
          </li>
          <li>
            <input
              type='text'
              className='info'
              placeholder='Lastname'
              value={user.lastname}
            />
          </li>
          <li>
            <input
              type='text'
              className='info'
              placeholder='Firstname'
              value={user.companyId}
            />
          </li>
          <li>
            <input
              type='text'
              className='info'
              placeholder='Firstname'
              value={user.roles}
            />
          </li>
          <li>
            <button
              type='button'
              className='button bottombtn'
              onClick={() => {
                signout()
              }}
            >
              <LogOut
                style={{
                  width: '20px',
                  height: '20px',
                  marginRight: '-20px',
                  float: 'left'
                }}
              />
              Logout
            </button>
          </li>
        </ul>
      </Section>
      <style jsx>{`
        .label {
          display: block;
          width: 100%;
        }
        .info {
          width: 100%;
        }
        li {
          color: var(--fg);
          padding: var(--gap-small);
          background: var(--base);
          display: flex;
          align-items: center;
          transition: var(--transition-colors);
        }

        .bottombtn {
          display: block;
          max-width: 400px;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
        }

        li:not(:last-child) {
          border-bottom: 1px solid var(--divider);
        }

        h4 {
          color: var(--fg);
          margin-left: var(--gap-small);
          font-weight: 500;
          letter-spacing: 0.0035em;
        }
      `}</style>
    </Page>
  )
})

export default Profile

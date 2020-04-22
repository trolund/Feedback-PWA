import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Settings, LogOut, Edit3, User as Avater, Key } from 'react-feather'
import Router from 'next/router'
import Page from '../components/page'
import User from '../models/User'
import Section from '../components/section'
import withAuth from '../services/withAuth'
import rootStore from '../stores/RootStore'

// import { User as Avatar } from '../models/User'

const Profile = withAuth(
  observer(() => {
    const {
      authStore: { getUser, signout }
    } = useContext(rootStore)

    const SettingsBtn = () => {
      return <Settings onClick={() => Router.push('/settings')} />
    }
    let user: User = { companyId: 0, firstname: '?', lastname: '?', roles: [] }
    if (typeof window !== 'undefined') user = getUser()
    return (
      <Page title='Profile' showBackButton={false} component={<SettingsBtn />}>
        <Section>
          <ul>
            <li>
              <Avater
                style={{
                  width: '90px',
                  height: '90px',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
              />
            </li>
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
                <Edit3
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '-20px',
                    float: 'left'
                  }}
                />
                Updater bruger
              </button>
            </li>
            <li>
              <button
                type='button'
                className='button bottombtn'
                onClick={() => {
                  signout()
                }}
              >
                <Key
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '-20px',
                    float: 'left'
                  }}
                />
                Skift kodeord
              </button>
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
)

export default Profile

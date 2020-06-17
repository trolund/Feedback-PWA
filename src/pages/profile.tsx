import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import {
  Settings,
  LogOut,
  Edit3,
  Key,
  Briefcase,
  Phone,
  Mail,
  Hash
} from 'react-feather'
import Router from 'next/router'
import Page from '../components/essentials/page'
import Section from '../components/essentials/section'
import withAuth from '../components/hoc/withAuth'
import rootStore from '../stores/RootStore'
import CustomInput from '../components/Input/custom-input'
import MiddelLoader from '../components/essentials/middelLoading'
import IUser from '../models/User'
import { getCompanyId } from '../services/authService'
import { toast } from 'react-toastify'
import { logEvent } from '../utils/analytics'

const Profile = withAuth(
  observer(() => {
    const {
      clearAll,
      authStore: { signout, user, updateUserInfo, setUser }
    } = useContext(rootStore)
    const SettingsBtn = () => {
      return <Settings onClick={() => Router.push('/settings')} />
    }

    const userUpdateClickHandler = () => {
      updateUserInfo(user).then(updatedUser => {
        if (user !== null) {
          const newUser = {
            ...user,
            firstname: updatedUser.firstname,
            lastname: updatedUser.lastname,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber
          } as IUser

          setUser(newUser)
          toast('Bruger blev upateret')
          logEvent('User-update', 'User-update-sucsess')
        } else {
          toast('Bruger blev ikke upateret')
          logEvent('User-update', 'User-update-error')
        }
      })
    }

    return (
      <Page title='Bruger' showBackButton={false} component={<SettingsBtn />}>
        <Section>
          <MiddelLoader loading={user === null} />
          {user !== null && (
            <ul>
              <li>
                <CustomInput
                  fill
                  logo={<Edit3 />}
                  type='text'
                  className='info'
                  placeholder='Firstname'
                  value={user.firstname}
                  onChange={value => setUser({ ...user, firstname: value })}
                />
              </li>
              <li>
                <CustomInput
                  fill
                  logo={<Edit3 />}
                  type='text'
                  className='info'
                  placeholder='Lastname'
                  value={user.lastname}
                  onChange={value => setUser({ ...user, lastname: value })}
                />
              </li>
              <li>
                <CustomInput
                  fill
                  logo={<Mail />}
                  type='text'
                  className='info'
                  placeholder='Email'
                  value={user.email}
                  onChange={value => setUser({ ...user, email: value })}
                />
              </li>
              {/* <li>
              <CustomInput
                logo={<Briefcase />}
                type='text'
                fill
                className='info'
                placeholder='Firma navn'
                value={`${user.companyId} - ${user.companyName}`}
              />
            </li> */}
              <li>
                <CustomInput
                  logo={<Phone />}
                  fill
                  type='text'
                  className='info'
                  placeholder='Firma navn'
                  value={user.phoneNumber}
                  onChange={value => setUser({ ...user, email: value })}
                />
              </li>
              <li>
                {user.companyConfirmed ? (
                  <span>
                    <Briefcase style={{ marginBottom: '-5px' }} />
                    <p style={{ marginLeft: '10px', display: 'inline' }}>
                      Du er godkendt medarbejder hos {user.companyName}.
                    </p>
                  </span>
                ) : (
                  <p>
                    Du mangler at blive godkendt af din
                    virksomheds-administator.
                  </p>
                )}
              </li>
              <li>
                <Hash style={{ marginBottom: '-5px' }} />
                <p style={{ marginLeft: '10px', display: 'inline' }}>
                  Virksomheds ID - {getCompanyId() || 'unkendt'}
                </p>
              </li>
              <li>
                <Settings style={{ marginBottom: '-5px' }} />
                {user.roles.length > 0 ? (
                  <ul className='role-list'>
                    {user.roles.map(role => (
                      <li key={role}>{role}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Du har ingen roller tildelt</p>
                )}
              </li>
              <li>
                <button
                  type='button'
                  className='button bottombtn'
                  onClick={userUpdateClickHandler}
                >
                  <Edit3
                    style={{
                      width: '20px',
                      height: '20px',
                      marginRight: '-20px',
                      float: 'left'
                    }}
                  />
                  Opdater bruger
                </button>
              </li>
              <li>
                <button
                  type='button'
                  className='button bottombtn'
                  onClick={() => {
                    Router.push('/newpassword')
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
                    signout().then(() => {
                      clearAll()
                    })
                  }}
                  cy-data='logout-btn'
                >
                  <LogOut
                    style={{
                      width: '20px',
                      height: '20px',
                      marginRight: '-20px',
                      float: 'left'
                    }}
                  />
                  Logud
                </button>
              </li>
            </ul>
          )}
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

          .role-list {
            list-style: none;
            padding: 0;
            border: none;
            padding: var(--gap-small);
          }

          .role-list > li {
            border: none;
            display: inline;
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

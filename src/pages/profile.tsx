/* eslint-disable react/no-array-index-key */
import { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import {
  Settings,
  LogOut,
  Edit3,
  Key,
  Briefcase,
  Phone,
  Mail
} from 'react-feather'
import Router from 'next/router'
import Page from '../components/page'
import Section from '../components/section'
import withAuth from '../services/withAuth'
import rootStore from '../stores/RootStore'
import CustomInput from '../components/custom-input'
import MiddelLoader from '../components/middelLoading'
import IUser from '../models/User'

// import { User as Avatar } from '../models/User'

const Profile = withAuth(
  observer(() => {
    const {
      authStore: { getUser, signout, updateUserInfo, setUser: setUserGlobale }
    } = useContext(rootStore)
    const [user, setUser] = useState(null)

    useEffect(() => {
      setUser(getUser())
    }, [getUser])

    const SettingsBtn = () => {
      return <Settings onClick={() => Router.push('/settings')} />
    }

    const userUpdateClickHandler = () => {
      updateUserInfo(user).then(updatedUser => {
        const newUser = {
          ...user,
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber
        } as IUser

        setUserGlobale(newUser)
        setUser(newUser)
      })
    }

    return (
      <Page title='Bruger' showBackButton={false} component={<SettingsBtn />}>
        <Section>
          <MiddelLoader loading={user === null} />
          {user !== null && (
            <ul>
              {/* <li>
              <Avater
                style={{
                  width: '90px',
                  height: '90px',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
              />
            </li> */}
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
                    Du mangler at blive godkendt af din virksomheds
                    administator.
                  </p>
                )}
              </li>

              <li>
                <Settings style={{ marginBottom: '-5px' }} />
                {user.roles.length > 0 ? (
                  <ul>
                    {user.roles.map((role, index) => (
                      <li key={index}>{role}</li>
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
                  Updater bruger
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

import { useContext, useState, FormEvent } from 'react'
import { observer } from 'mobx-react-lite'
import { Key } from 'react-feather'
import Lottie from 'react-lottie'
import Router from 'next/router'
import withAuth from '../../components/hoc/withAuth'
import rootStore from '../../stores/RootStore'
import Page from '../../components/essentials/page'
import Section from '../../components/essentials/section'
import CustomInput from '../../components/Input/custom-input'
import NewPasswordModel from '../../models/NewPasswordModel'
import FetchStates from '../../stores/requestState'
import { validateNewPassword } from '../../services/validationService'
import * as loading from '../../../public/Animations/loading.json'

const NewPassword = withAuth(
  observer(() => {
    const {
      authStore: { updatePassword, state }
    } = useContext(rootStore)

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordA, setNewPasswordA] = useState('')
    const [errors, setErrors] = useState([])

    const updatePasswordSubmithandler = (e: FormEvent) => {
      e.preventDefault()
      const model: NewPasswordModel = {
        oldPassword,
        newPassword,
        newPasswordAgain: newPasswordA
      }
      const validationRes = validateNewPassword(newPassword, newPasswordA)
      if (validationRes.valid) {
        updatePassword(model).then(res => {
          if (res === FetchStates.DONE) {
            Router.back()
          } else if (res === FetchStates.FAILED) {
            setErrors([
              'Kodeord blev IKKE ændret, er dit nuværende kodeord korrekt?'
            ])
          }
        })
      } else {
        setErrors(validationRes.validationErrors)
      }
    }

    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: (loading as any).default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    }

    return (
      <Page title='Nyt kodeord' showBackButton>
        <Section>
          <ul>
            <form onSubmit={updatePasswordSubmithandler}>
              <li>
                <CustomInput
                  fill
                  logo={<Key />}
                  type='password'
                  className='info'
                  placeholder='Nuværende kodeord'
                  value={oldPassword}
                  onChange={e => setOldPassword(e)}
                />
              </li>
              <li>
                <CustomInput
                  type='password'
                  error={errors.length > 0}
                  fill
                  logo={<Key />}
                  className='info'
                  placeholder='Nyt kodeord'
                  value={newPassword}
                  onChange={e => setNewPassword(e)}
                />
              </li>
              <li>
                <CustomInput
                  error={errors.length > 0}
                  fill
                  logo={<Key />}
                  type='password'
                  className='info'
                  placeholder='Nyt kodeord igen'
                  value={newPasswordA}
                  onChange={e => setNewPasswordA(e)}
                />
              </li>
              {errors.length > 0 && (
                <li>
                  <ul
                    style={{
                      color: 'var(--error)',
                      marginRight: 'auto',
                      marginLeft: 'auto'
                    }}
                  >
                    {errors.map(e => (
                      <li style={{ textAlign: 'center', display: 'block' }}>
                        {e}
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              <li>
                <button
                  type='submit'
                  className='button bottombtn'
                  //   onClick={e => {
                  //     updatePasswordSubmithandler(e)
                  //   }}
                >
                  {state === FetchStates.LOADING ? (
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        marginRight: '-20px',
                        float: 'left'
                      }}
                    >
                      <Lottie options={defaultOptions} height={20} width={20} />
                    </span>
                  ) : (
                    <Key
                      style={{
                        width: '20px',
                        height: '20px',
                        marginRight: '-20px',
                        float: 'left'
                      }}
                    />
                  )}
                  Skift kodeord
                </button>
              </li>
            </form>
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

export default NewPassword

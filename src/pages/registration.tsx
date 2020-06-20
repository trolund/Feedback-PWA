/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useContext } from 'react'
import { User, Mail, Phone, Key, Briefcase, Hash, X } from 'react-feather'
import { toast } from 'react-toastify'
import Router from 'next/router'
import { observer } from 'mobx-react'
import Modal from 'react-modal'
import Link from 'next/link'
import Page from '../components/essentials/page'
import Section from '../components/essentials/section'
import Registration from '../models/Registration'
import Company from '../models/Company'
import * as mail from '../../public/Animations/mail.json'
import AnimationOverlay from '../components/essentials/animation-overlay'
import FetchStates from '../stores/requestState'
import rootStore from '../stores/RootStore'
import CustomInput from '../components/Input/custom-input'
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateNewPassword,
  validateNotEmpty
} from '../services/validationService'
import CustomCheckbox from '../components/Input/checkbox'
import MiddelLoader from '../components/essentials/middelLoading'

export default observer(() => {
  const [newCompany, setNewCompany] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [password, setPassword] = useState('')
  const [passwordAgain, setPasswordAgain] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [showOverlay, setShowOverlay] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [accept, setAccept] = useState(false)
  const [showGDPR, setShowGDPR] = useState(false)
  const {
    authStore: { createUser, fetchState: state, msg }
  } = useContext(rootStore)

  const createUserClickHandler = () => {
    if (
      !(
        validateNotEmpty(firstname).valid &&
        validateNotEmpty(lastname).valid &&
        validatePhone(phone).valid &&
        validatePhone(phone).valid &&
        validateNewPassword(password, passwordAgain) &&
        validatePassword(password) &&
        validateNotEmpty(companyName)
      )
    ) {
      setShowErrors(true)
      return
    }

    const newModelCompany: any = {
      company: { name: companyName } as Company
    }

    const exsitingCompany: any = {
      companyId: Number(companyId)
    }

    const requesetedRoles: string[] = []

    let model: Registration = {
      email,
      password,
      passwordAgain,
      firstname,
      lastname,
      requesetedRoles,
      phone
    }

    if (newCompany) {
      model = {
        ...model,
        ...newModelCompany
      }
      requesetedRoles.push('VAdmin')
    } else {
      model = {
        ...model,
        ...exsitingCompany
      }
      requesetedRoles.push('Facilitator')
    }

    createUser(model).then(statuscode => {
      if (statuscode === 200) {
        setShowOverlay(true)
      } else if (statuscode === 409) {
        toast('Der findes allerede en bruger med denne email.')
      } else {
        toast('Brugeren blev ikke oprettet.')
      }
    })
  }

  const onAnimationComplete = () => {
    Router.push('/login')
  }

  const errorList = (errors: string[]) =>
    showErrors && (
      <ul>
        {errors.map(e => (
          <li key={e}>{e}</li>
        ))}
        <style jsx>{`
          ul {
            text-align: center;
          }
        `}</style>
      </ul>
    )

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: 'var(--gap)',
      maxWidth: '800px',
      userSelect: 'none'
    }
  }

  return (
    <Page title='Opret bruger' showBottomNav={false} showBackButton>
      {showOverlay && (
        <AnimationOverlay
          text='Aktiverings link er afsendt til dig.'
          animation={mail}
          onComplete={onAnimationComplete}
        />
      )}
      <MiddelLoader
        loading={state === FetchStates.LOADING}
        text='Forsøger at oprette bruger'
      />
      <Section>
        <li>
          <CustomInput
            id='firstname'
            error={!validateNotEmpty(firstname).valid && showErrors}
            logo={<User />}
            type='text'
            placeholder='Fornavn'
            value={firstname}
            onChange={e => {
              setFirstname(e)
            }}
          />
        </li>
        {errorList(validateNotEmpty(firstname).validationErrors)}
        <li>
          <CustomInput
            id='lastname'
            error={!validateNotEmpty(lastname).valid && showErrors}
            logo={<User />}
            type='text'
            placeholder='Efternavn'
            value={lastname}
            onChange={e => {
              setLastname(e)
            }}
          />
        </li>
        <li>
          <CustomInput
            id='phone'
            error={!validatePhone(phone).valid && showErrors}
            logo={<Phone />}
            type='text'
            placeholder='Telefon nr.'
            value={phone}
            onChange={e => {
              setPhone(e)
            }}
          />
        </li>
        {errorList(validatePhone(phone).validationErrors)}
        <li>
          <CustomInput
            id='email'
            error={!validateEmail(email).valid && showErrors}
            logo={<Mail />}
            type='email'
            placeholder='Email'
            value={email}
            onChange={e => {
              setEmail(e)
            }}
          />
          {errorList(validateNotEmpty(email).validationErrors)}
        </li>
        <li>
          <CustomInput
            id='password'
            error={!validatePassword(password).valid && showErrors}
            logo={<Key />}
            type='password'
            placeholder='Kodeord'
            value={password}
            onChange={e => {
              setPassword(e)
            }}
          />
          {errorList(validateNotEmpty(email).validationErrors)}
        </li>
        <li>
          <CustomInput
            id='passworda'
            error={
              !validateNewPassword(password, passwordAgain).valid && showErrors
            }
            logo={<Key />}
            type='password'
            placeholder='Kodeord igen'
            value={passwordAgain}
            onChange={e => {
              setPasswordAgain(e)
            }}
          />
          {errorList(
            validateNewPassword(password, passwordAgain).validationErrors
          )}
        </li>
        <li>
          <div className='toggle'>
            <input
              type='radio'
              name='sizeBy'
              value='weight'
              id='sizeWeight'
              checked={!newCompany}
              onChange={() => {}}
              onClick={() => setNewCompany(!newCompany)}
            />
            <label className='newCompanybtn' htmlFor='sizeWeight'>
              Virksomheds ID
            </label>
            <input
              className='oldCompanybtn'
              type='radio'
              name='sizeBy'
              value='dimensions'
              id='sizeDimensions'
              checked={newCompany}
              onChange={() => {}}
              onClick={() => setNewCompany(!newCompany)}
            />
            <label htmlFor='sizeDimensions'>Ny virksomhed</label>
          </div>
        </li>
        <li>
          <div>
            {!newCompany ? (
              <CustomInput
                id='companyid'
                logo={<Hash />}
                type='text'
                placeholder='Virksomheds ID'
                value={companyId}
                onChange={e => {
                  setCompanyId(e)
                }}
              />
            ) : (
              <>
                <CustomInput
                  id='companyname'
                  error={!validateNotEmpty(companyName).valid && showErrors}
                  logo={<Briefcase />}
                  type='text'
                  placeholder='Virksomheds navn'
                  value={companyName}
                  onChange={e => {
                    setCompanyName(e)
                  }}
                />
                {errorList(validateNotEmpty(companyName).validationErrors)}
              </>
            )}
          </div>
        </li>
        <hr />
        <li style={{ textAlign: 'center' }}>
          <a
            tabIndex={0}
            role='button'
            onKeyDown={() => setShowGDPR(true)}
            onClick={() => setShowGDPR(true)}
            style={{
              color: 'var(--accent)',
              margin: '10px',
              cursor: 'pointer'
            }}
            className='noSelect'
          >
            Læs vilkår
          </a>
          <div
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width: 'fit-content',
              paddingTop: '30px'
            }}
          >
            <CustomCheckbox
              id='accept'
              onChange={setAccept}
              checked={accept}
              label='Accepter vilkår'
            />
          </div>
          <Modal
            isOpen={showGDPR}
            contentLabel='Example Modal'
            className='modal noSelect'
            overlayClassName='Overlay'
            style={customStyles}
          >
            <h2>Vilkår</h2>
            <X
              onClick={() => setShowGDPR(false)}
              style={{
                float: 'right',
                margin: 'var(--gap-small)',
                position: 'absolute',
                right: '0',
                top: 0
              }}
            />
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
              quis lectus quis sem lacinia nonummy. Proin mollis lorem non
              dolor. In hac habitasse platea dictumst. Nulla ultrices odio.
              Donec augue. Phasellus dui. Maecenas facilisis nisl vitae nibh.
              Proin vel seo est vitae eros pretium dignissim. Aliquam aliquam
              sodales orci. Suspendisse potenti. Nunc adipiscing euismod arcu.
              Quisque facilisis mattis lacus. Fusce bibendum, velit in venenatis
              viverra, tellus ligula dignissim felis, quis euismod mauris tellus
              ut urna. Proin scelerisque. Nulla in mi. Integer ac leo. Nunc urna
              ligula, gravida a, pretium vitae, bibendum nec, ante. Aliquam
              ullamcorper iaculis lectus. Sed vel dui. Etiam lacinia risus vitae
              lacus. Aliquam elementum imperdiet turpis. In id metus. Mauris eu
              nisl. Nam pharetra nisi nec enim. Nulla aliquam, tellus sed
              laoreet blandit, eros urna vehicula lectus, et vulputate mauris
              arcu ut arcu. Praesent eros metus lirum larum, accumsan a,
              malesuada et, commodo vel, nulla. Aliquam sagittis auctor sapien.
              Morbi a nibh.
            </div>
            <button
              className='button bottombtn'
              onClick={() => {
                setAccept(true)
                setShowGDPR(false)
              }}
              style={{ marginTop: 'var(--gap)' }}
            >
              Accepter
            </button>
          </Modal>
        </li>

        <Link href='#'>
          <button
            id='submit'
            disabled={!accept || state === FetchStates.LOADING}
            tabIndex={0}
            type='button'
            title='login'
            aria-label='login'
            onKeyDown={createUserClickHandler}
            onClick={createUserClickHandler}
            className='button loginBtn bottombtn'
          >
            {newCompany ? 'Opret bruger og virksomhed' : 'Opret bruger'}
          </button>
        </Link>
      </Section>

      <style jsx>{`
        li {
          padding: var(--gap-small);
        }
        .loginBtn {
          margin-top: 40px;
        }
        .button {
          display: table;
        }
        input {
          margin-top: 20px;
          margin-left: auto;
          margin-right: auto;
        }

        a {
          margin-left: auto;
          margin-right: auto;
        }
        body:not(:-moz-handler-blocked) fieldset {
          display: table-cell;
        }

        /* TOGGLE STYLING */
        .toggle {
          margin: 0 0 1.5rem;
          box-sizing: border-box;
          font-size: 0;
          display: -webkit-box;
          display: flex;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
          flex-flow: row nowrap;
          -webkit-box-pack: start;
          justify-content: flex-start;
          -webkit-box-align: stretch;
          align-items: stretch;
          margin-top: 30px;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
          width: fit-content;
        }
        .toggle input {
          width: 0;
          height: 0;
          position: absolute;
          left: -9999px;
        }
        .toggle input + label {
          margin: 0;
          padding: 0.75rem 2rem;
          box-sizing: border-box;
          position: relative;
          display: inline-block;
          border: solid 1px #ddd;
          background-color: var(--accent-low);
          font-size: 1rem;
          line-height: 140%;
          font-weight: 600;
          text-align: center;
          box-shadow: 0 0 0 rgba(255, 255, 255, 0);
          -webkit-transition: border-color 0.15s ease-out, color 0.25s ease-out,
            background-color 0.15s ease-out, box-shadow 0.15s ease-out;
          transition: border-color 0.15s ease-out, color 0.25s ease-out,
            background-color 0.15s ease-out, box-shadow 0.15s ease-out;
          /* ADD THESE PROPERTIES TO SWITCH FROM AUTO WIDTH TO FULL WIDTH */
          /*flex: 0 0 50%; display: flex; justify-content: center; align-items: center;*/
          /* ----- */
        }
        .toggle input + label:first-of-type {
          border-radius: 15px 0 0 15px;
          border-right: none;
        }
        .toggle input + label:last-of-type {
          border-radius: 0 15px 15px 0;
          border-left: none;
        }
        .toggle input:hover + label {
          background-color: var(--surface);
        }
        .toggle input:checked + label {
          background-color: var(--accent);
          color: #fff;
          box-shadow: 0 0 10px rgba(102, 179, 251, 0.5);
          border-color: var(--accent);
          z-index: 1;
        }
        .toggle input:focus + label {
          outline: dotted 1px #ccc;
          outline-offset: 0.45rem;
        }
        @media (max-width: 800px) {
          .toggle input + label {
            padding: 0.75rem 0.25rem;
            -webkit-box-flex: 0;
            #flex: 0 0 50%;
            display: -webkit-box;
            display: flex;
            -webkit-box-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            align-items: center;
          }
        }

        /* STYLING FOR THE STATUS HELPER TEXT FOR THE DEMO */
        .status {
          margin: 0;
          font-size: 1rem;
          font-weight: 400;
        }
        .status span {
          font-weight: 600;
          color: #b6985a;
        }
        .status span:first-of-type {
          display: inline;
        }
        .status span:last-of-type {
          display: none;
        }
        @media (max-width: 800px) {
          .status span:first-of-type {
            display: none;
          }
          .status span:last-of-type {
            display: inline;
          }
        }
      `}</style>
    </Page>
  )
})

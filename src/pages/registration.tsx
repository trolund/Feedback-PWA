/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useContext } from 'react'
import { User, Mail, Phone, Key, Briefcase, Hash, X } from 'react-feather'
import Router from 'next/router'
import Modal from 'react-modal'
import Link from 'next/link'
import Page from '../components/page'
import Section from '../components/section'
import Registration from '../models/Registration'
import Company from '../models/Company'
import * as mail from '../../public/Animations/mail.json'
import AnimationOverlay from '../components/animation-overlay'
import FetchStates from '../stores/requestState'
import rootStore from '../stores/RootStore'
import CustomInput from '../components/custom-input'
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateNewPassword,
  validateNotEmpty
} from '../services/validationService'
import CustomCheckbox from '../components/checkbox'

export default () => {
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
    authStore: { createUser }
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

    createUser(model).then(res => {
      if (res === FetchStates.DONE) {
        setShowOverlay(true)
      }
    })
  }

  // const createUserClickHandler = () => {
  //   setShowOverlay(true)
  // }

  const onAnimationComplete = () => {
    Router.push('/login')
  }

  const errorList = (errors: string[]) =>
    showErrors && (
      <ul>
        {errors.map(e => (
          <li>{e}</li>
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
      width: '100%',
      height: '100%',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  }

  return (
    <Page title='Opret bruger' showBottomNav={false} showBackButton>
      <Section>
        <li>
          <CustomInput
            error={!validateNotEmpty(firstname).valid && showErrors}
            logo={<User />}
            type='text'
            placeholder='Firstname'
            value={firstname}
            onChange={e => {
              setFirstname(e)
            }}
          />
        </li>
        {errorList(validateNotEmpty(firstname).validationErrors)}
        <li>
          <CustomInput
            error={!validateNotEmpty(lastname).valid && showErrors}
            logo={<User />}
            type='text'
            placeholder='Lastname'
            value={lastname}
            onChange={e => {
              setLastname(e)
            }}
          />
        </li>
        <li>
          <CustomInput
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
            error={!validateEmail(email).valid && showErrors}
            logo={<Mail />}
            type='text'
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
            <label htmlFor='sizeWeight'>Existeende virksomhed</label>
            <input
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
            tabIndex={-1}
            role='button'
            onKeyDown={() => setShowGDPR(true)}
            onClick={() => setShowGDPR(true)}
            style={{ color: 'var(--accent)', margin: '10px' }}
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
              onChange={setAccept}
              checked={accept}
              label='Accepter vilkår'
            />
          </div>
          <Modal
            isOpen={showGDPR}
            contentLabel='Example Modal'
            className='modal'
            overlayClassName='Overlay'
            style={customStyles}
          >
            <h2>Besvarelse ikke klar!</h2>
            <button
              type='button'
              tabIndex={0}
              onClick={() => setShowGDPR(false)}
            >
              <X /> close
            </button>
            <div>det du skal acceptere..</div>
          </Modal>
        </li>

        <Link href='#'>
          <button
            disabled={!accept}
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
      {showOverlay && (
        <AnimationOverlay
          text='Aktiverings link er afsendt til dig.'
          animation={mail}
          onComplete={onAnimationComplete}
        />
      )}
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
}

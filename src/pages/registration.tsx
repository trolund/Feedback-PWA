/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useContext } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import Page from '../components/page'
import Section from '../components/section'
import Registration from '../models/Registration'
import Company from '../models/Company'
import * as mail from '../../public/Animations/mail.json'
import AnimationOverlay from '../components/animation-overlay'
import FetchStates from '../stores/requestState'
import rootStore from '../stores/RootStore'

export default () => {
  const [newCompany, setNewCompany] = useState(false)
  const [companyName, setCompanyName] = useState(null)
  const [companyId, setCompanyId] = useState(null)
  const [password, setPassword] = useState('')
  const [passwordAgain, setPasswordAgain] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [showOverlay, setShowOverlay] = useState(false)
  const {
    authStore: { createUser }
  } = useContext(rootStore)

  const createUserClickHandler = () => {
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
      phone: '29456660'
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

  return (
    <Page title='Opret bruger' showBottomNav={false} showBackButton>
      <Section>
        <input
          type='text'
          placeholder='Firstname'
          value={firstname}
          onChange={e => {
            setFirstname(e.target.value)
          }}
        />
        <input
          type='text'
          placeholder='Lastname'
          value={lastname}
          onChange={e => {
            setLastname(e.target.value)
          }}
        />
        <input
          type='text'
          placeholder='Email'
          value={email}
          onChange={e => {
            setEmail(e.target.value)
          }}
        />
        <input
          type='password'
          placeholder='Kodeord'
          value={password}
          onChange={e => {
            setPassword(e.target.value)
          }}
        />
        <input
          type='password'
          placeholder='Kodeord igen'
          value={passwordAgain}
          onChange={e => {
            setPasswordAgain(e.target.value)
          }}
        />
        <div className='toggle'>
          <input
            type='radio'
            name='sizeBy'
            value='weight'
            id='sizeWeight'
            checked={!newCompany}
            onClick={() => setNewCompany(!newCompany)}
          />
          <label htmlFor='sizeWeight'>Existeende virksomhed</label>
          <input
            type='radio'
            name='sizeBy'
            value='dimensions'
            id='sizeDimensions'
            checked={newCompany}
            onClick={() => setNewCompany(!newCompany)}
          />
          <label htmlFor='sizeDimensions'>Ny virksomhed</label>
        </div>
        <div>
          {!newCompany ? (
            <input
              type='text'
              placeholder='Virksomheds ID'
              value={companyId}
              onChange={e => {
                setCompanyId(e.target.value)
              }}
            />
          ) : (
            <input
              type='text'
              placeholder='Virksomheds navn'
              value={companyName}
              onChange={e => {
                setCompanyName(e.target.value)
              }}
            />
          )}
        </div>
        <Link href='#'>
          <a
            tabIndex={0}
            role='button'
            title='login'
            aria-label='login'
            onKeyDown={createUserClickHandler}
            onClick={createUserClickHandler}
            className='button loginBtn'
          >
            {newCompany ? 'Opret bruger og virksomhed' : 'Opret bruger'}
          </a>
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
        .loginBtn {
          margin-top: 50px;
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

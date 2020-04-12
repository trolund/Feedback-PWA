/* eslint-disable react/destructuring-assignment */
import Router from 'next/router'
import { useEffect, useContext } from 'react'
import JwtDecode from 'jwt-decode'
import { auth } from './authService'
import authStore from '../stores/authStore'
import TokenModel from '../models/TokenModel'

const withAuth = WrappedComponent => {
  const Wrapper = props => {
    const { setRoles, isAdmin } = useContext(authStore)

    const syncLogout = event => {
      if (event.key === 'logout') {
        console.debug('logged out from storage!')
        setRoles(null, null, null)
        Router.push('/login')
      }
    }

    useEffect(() => {
      if (isAdmin === null) {
        const token: TokenModel = JwtDecode(props.token)
        setRoles(
          token.role.includes('Admin'),
          token.role.includes('Facilitator'),
          token.role.includes('VAdmin')
        )
      }
    }, [isAdmin, props.token, setRoles])

    useEffect(() => {
      window.addEventListener('storage', syncLogout)

      return () => {
        window.removeEventListener('storage', syncLogout)
        window.localStorage.removeItem('logout')
      }
    }, [])

    return <WrappedComponent {...props} />
  }

  Wrapper.getInitialProps = async ctx => {
    const token = auth(ctx)
    console.log('the token', token)

    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx))

    return { ...componentProps, token }
  }

  return Wrapper
}

export default withAuth

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/destructuring-assignment */
import Router from 'next/router'
import { useEffect, useContext } from 'react'
import JwtDecode from 'jwt-decode'
import { auth } from '../../services/authService'
import TokenModel from '../../models/TokenModel'
import rootStore from '../../stores/RootStore'
import Roles from '../../models/enums/roles'

const withAuth = (WrappedComponent, roles?: Roles[]) => {
  const Wrapper = props => {
    const {
      authStore: { setRoles, isAdmin, isFacilitator, isVAdmin }
    } = useContext(rootStore)

    const syncLogout = event => {
      if (event.key === 'logout') {
        console.debug('logged out from storage!')
        setRoles(null, null, null)
        Router.push('/login')
      }
    }

    const blockWithRoles = () => {
      if (roles) {
        if (
          (roles.includes(Roles.ADMIN) && !isAdmin) ||
          (roles.includes(Roles.FACILITATOR) && !isFacilitator) ||
          (roles.includes(Roles.VADMIN) && !isVAdmin)
        ) {
          Router.back()
        }
      }
    }

    useEffect(() => {
      // if roles is not set set them
      if (isAdmin === null) {
        const token: TokenModel = JwtDecode(props.token)
        setRoles(
          token.role.includes(Roles.ADMIN),
          token.role.includes(Roles.FACILITATOR),
          token.role.includes(Roles.VADMIN)
        )
      }
      blockWithRoles()
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

    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx))

    return { ...componentProps, token }
  }

  return Wrapper
}

export default withAuth

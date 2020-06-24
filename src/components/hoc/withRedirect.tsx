import { useEffect } from 'react'
import Router from 'next/router'
import { tokenValid, getToken, redirect } from '../../services/authService'

const withRedirect = WrappedComponent => {
  const Wrapper = props => {
    // fallback
    // useEffect(() => {
    //   const token = getToken()
    //   console.log(token, tokenValid(token))
    //   if (token !== undefined && tokenValid(token)) {
    //     Router.push('/home')
    //   }
    // }, [])

    return <WrappedComponent {...props} />
  }

  Wrapper.getInitialProps = async ctx => {
    redirect(ctx)

    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx))

    return { ...componentProps }
  }

  return Wrapper
}

export default withRedirect

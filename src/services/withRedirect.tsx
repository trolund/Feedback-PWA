import { useEffect } from 'react'
import Router from 'next/router'
import { tokenValid, getToken } from './authService'

const withRedirect = WrappedComponent => {
  const Wrapper = props => {
    useEffect(() => {
      const token = getToken()
      console.log(token, tokenValid(token))
      if (token !== undefined && tokenValid(token)) {
        Router.push('/home')
      }
    }, [])

    return <WrappedComponent {...props} />
  }

  // Wrapper.getInitialProps = async ctx => {
  //   const token = auth(ctx)

  //   console.log(token, tokenValid(token))

  //   // if (token !== undefined && tokenValid(token)) {
  //   //   ctx.res.writeHead(302, { Location: '/home' })
  //   //   ctx.res.end()
  //   // }

  //   const componentProps =
  //     WrappedComponent.getInitialProps &&
  //     (await WrappedComponent.getInitialProps(ctx))

  //   return { ...componentProps }
  // }

  return Wrapper
}

export default withRedirect

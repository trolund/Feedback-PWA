import Head from 'next/head'
import { AppProps } from 'next/app'
import '../styles/global.css'
// import { Provider } from 'mobx-react'

// import initializeStore from '../stores/stores'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Feedback</title>
        <meta charSet='utf-8' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta
          name='apple-mobile-web-app-status-bar-style'
          content='black-translucent'
        />
        <meta name='apple-mobile-web-app-title' content='pub' />
        <meta name='application-name' content='pub' />
        <meta name='description' content='Company internal hub' />
        <meta name='theme-color' content='#457ef7' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, user-scalable=0, viewport-fit=cover'
        />
        <link rel='apple-touch-icon' href='/images/icon-192.png' />
        <link rel='icon' type='image/png' href='/favicon.png' />
        <link rel='manifest' href='/manifest.json' />
      </Head>

      <Component {...pageProps} />
    </>
  )
}

export default App

// export default class App extends App {
//   mobxStore: any

//   static async getInitialProps(appContext: any) {
//     const mobxStore = initializeStore()
//     // eslint-disable-next-line no-param-reassign
//     appContext.ctx.mobxStore = mobxStore
//     const appProps = await App.getInitialProps(appContext)
//     return {
//       ...appProps,
//       initialMobxState: mobxStore
//     }
//   }

//   constructor(props: AppProps) {
//     super(props)
//     const isServer = typeof window === 'undefined'
//     this.mobxStore = isServer
//       ? props.initialMobxState
//       : initializeStore(props.initialMobxState)
//   }

//   render() {
//     const { Component, pageProps } = this.props
//     return (
//       <Provider {...this.mobxStore}>
//         <Head>
//           <title>Feedback</title>
//           <meta charSet='utf-8' />
//           <meta name='mobile-web-app-capable' content='yes' />
//           <meta name='apple-mobile-web-app-capable' content='yes' />
//           <meta
//             name='apple-mobile-web-app-status-bar-style'
//             content='black-translucent'
//           />
//           <meta name='apple-mobile-web-app-title' content='pub' />
//           <meta name='application-name' content='pub' />
//           <meta name='description' content='Company internal hub' />
//           <meta name='theme-color' content='#457ef7' />
//           <meta
//             name='viewport'
//             content='width=device-width, initial-scale=1, user-scalable=0, viewport-fit=cover'
//           />
//           <link rel='apple-touch-icon' href='/images/icon-192.png' />
//           <link rel='icon' type='image/png' href='/favicon.png' />
//           <link rel='manifest' href='/manifest.json' />
//         </Head>

//         <Component {...pageProps} />
//       </Provider>
//     )
//   }
// }

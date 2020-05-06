import Head from 'next/head'
import { AppProps } from 'next/app'
import CookieConsent from 'react-cookie-consent'
import '../styles/global.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import 'react-infinite-calendar/styles.css'
import Prompt from '../components/AddToHomescreenPrompt'

const App = ({ Component, pageProps }: AppProps) => {
  // create fingerprint if needed
  // const {
  //   authStore: { fingerprint, setFingerprint }
  // } = useContext(rootStore)
  // useEffect(() => {
  //   if (fingerprint === null || fingerprint.exp < Date.now()) {
  //     window.addEventListener('load', () => {
  //       // wait to get consistent fingerprint
  //       setTimeout(async () => {
  //         const newFingerprint = await createFingerprint()
  //         setFingerprint(newFingerprint)
  //         const cookie = new Cookies()
  //         cookie.set('fingerprint', newFingerprint)

  //         // cookie.addChangeListener(async () =>
  //         //   cookie.set('fingerprint', await createFingerprint())
  //         // )
  //         // eslint-disable-next-line no-restricted-globals
  //         // location.reload()
  //       }, 500)
  //     })
  //   }
  // }, [fingerprint, setFingerprint])

  return (
    <>
      <Head>
        <title>Feedback</title>
        <meta charSet='utf-8' />
        <meta name='mobile-web-app-capable' content='yes' />
        {/* <meta name='apple-mobile-web-app-capable' content='yes' />  https://bugs.webkit.org/show_bug.cgi?id=185448 - gets the camera too work */}
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

        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/images/pwa/apple-icon-180.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='167x167'
          href='/images/pwa/apple-icon-167.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='152x152'
          href='/images/pwa/apple-icon-152.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='120x120'
          href='/images/pwa/apple-icon-120.png'
        />

        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-2048-2732.png'
          media='(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-2732-2048.png'
          media='(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-1668-2388.png'
          media='(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-2388-1668.png'
          media='(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-1668-2224.png'
          media='(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-2224-1668.png'
          media='(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-1536-2048.png'
          media='(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-2048-1536.png'
          media='(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-1242-2688.png'
          media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-2688-1242.png'
          media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-1125-2436.png'
          media='(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-2436-1125.png'
          media='(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-828-1792.png'
          media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-1792-828.png'
          media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-1242-2208.png'
          media='(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-2208-1242.png'
          media='(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-750-1334.png'
          media='(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-1334-750.png'
          media='(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-640-1136.png'
          media='(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/images/pwa/apple-splash-1136-640.png'
          media='(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
        />
      </Head>
      <CookieConsent
        buttonClasses='button'
        containerClasses='cookie-box'
        contentClasses='text-capitalize'
      >
        This website uses cookies to enhance the user experience.{' '}
        <span style={{ fontSize: '10px' }}>This bit of text is smaller :O</span>
      </CookieConsent>

      <Prompt />
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

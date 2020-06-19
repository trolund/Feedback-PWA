import Head from 'next/head'
import { AppProps } from 'next/app'
import '../styles/global.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import 'react-infinite-calendar/styles.css'
import isServer from '../utils/helper'

declare global {
  interface Window {
    isDark: boolean
    GA_INITIALIZED: boolean
  }
}

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Opino</title>
        <meta charSet='utf-8' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        {/* https://bugs.webkit.org/show_bug.cgi?id=185448 - gets the camera too work */}
        {/* https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html */}

        <meta name='apple-mobile-web-app-status-bar-style' content='default' />

        <meta name='apple-mobile-web-app-title' content='pub' />
        <meta name='application-name' content='pub' />
        {/* <meta name='description' content='Company internal hub' />
        <meta name='theme-color' content='#457ef7' /> */}
        <meta name='theme-color' content='#0594a6' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, user-scalable=0, viewport-fit=cover'
        />

        <link rel='icon' type='image/png' href='/favicon.png' />
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/images/pwa/icon-192.png' />
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
      <Component {...pageProps} />
    </>
  )
}

export default App

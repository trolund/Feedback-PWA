import Head from 'next/head'
import Appbar from './appbar'
import BottomNav from './bottom-nav'
import BackAppHeader from './backAppbar'

type Props = {
  title?: string
  children: React.ReactNode
  showHead?: boolean
  showBottomNav?: boolean
  showBackButton?: boolean
}

const Page = ({
  title,
  children,
  showHead,
  showBottomNav,
  showBackButton
}: Props) => {
  const showHeader = showHead === undefined ? true : showHead
  const showBottomNaver = showBottomNav === undefined ? true : showBottomNav
  const showTheBackButton = showBackButton === undefined ? true : showBackButton
  return (
    <>
      {showHeader && (
        <>
          <Head>
            <title>{title ? `WebApp | ${title}` : 'WebApp'}</title>
          </Head>
          <Appbar />
        </>
      )}

      {showTheBackButton && <BackAppHeader />}

      <main>{children}</main>

      {showBottomNaver && <BottomNav />}

      <style jsx>{`
        main {
          margin: 0 auto;
          padding-top: calc(env(safe-area-inset-top) + 73px);
          padding-bottom: calc(env(safe-area-inset-bottom) + 73px);
          max-width: 40em;
          height: 100%;
          min-height: 100vh;
          background: var(--base);
          transition: var(--transition-colors);
        }
      `}</style>
    </>
  )
}

export default Page

import Head from 'next/head'
import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { motion } from 'framer-motion'
import Appbar from './appbar'
import BottomNav from './bottom-nav'
import rootStore from '../../stores/RootStore'

// import BackAppHeader from './backAppbar'

type Props = {
  title?: string
  children: React.ReactNode
  showHead?: boolean
  showBottomNav?: boolean
  showBackButton?: boolean
  fullscreen?: boolean
  component?: JSX.Element
  bgColor?: string
}

const Page = ({
  title,
  children,
  showHead,
  showBottomNav,
  showBackButton,
  component,
  fullscreen,
  bgColor
}: Props) => {
  const {
    settingStore: { animation }
  } = useContext(rootStore)

  const showHeader = showHead === undefined ? true : showHead
  const showBottomNaver = showBottomNav === undefined ? true : showBottomNav
  const showTheBackButton = showBackButton === undefined ? true : showBackButton
  const fullscreenMain = fullscreen === undefined ? false : fullscreen
  const bgStyle = bgColor ? { backgroundColor: bgColor } : {}

  return (
    <>
      {showHeader && (
        <>
          <Head>
            <title>{title ? `Opion | ${title}` : 'Opion'}</title>
          </Head>
          <Appbar
            title={title}
            backBtn={showTheBackButton}
            component={component}
          />
        </>
      )}

      {/* {showTheBackButton && <BackAppHeader />} */}
      <motion.div
        initial={animation ? { scale: 1, opacity: 0, y: -15 } : {}}
        animate={animation ? { scale: 1, opacity: 1, y: 0 } : {}}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20
        }}
      >
        <main
          style={
            fullscreenMain ? { padding: '0px', ...bgStyle } : { ...bgStyle }
          }
        >
          {children}
        </main>
      </motion.div>
      {showBottomNaver && <BottomNav />}

      <style jsx>{`
        @media only screen and (max-width: 650px) {
          main {
            margin: 0 auto;
            max-width: 40em;
            padding-left: 0px !important;
            padding-right: 0px !important;
          }
        }
        main {
          margin: auto auto;
          padding-left: 50px;
          padding-right: 50px;
          padding-top: calc(env(safe-area-inset-top) + 73px);
          padding-bottom: calc(env(safe-area-inset-bottom) + 73px);
          max-width: 90em;
          height: 100%;
          min-height: 100vh;
          background: var(--base);
          transition: var(--transition-colors);
        }
      `}</style>
    </>
  )
}

export default observer(Page)

import Router from 'next/router'
import { ChevronLeft } from 'react-feather'
// import Link from 'next/link'
// import UnnecessarilyComplexTitle from './unnecessarily-complex-title'
// import Avatar from './avatar'
// import ThemeButton from './theme-button'

type appbarProps = {
  title?: string
  backBtn?: boolean
  component?: JSX.Element
}

const Header = (props: appbarProps) => {
  const { title, backBtn, component } = props
  // const [loaded, setLoaded] = useState(false)

  // useEffect(() => {
  //   setLoaded(true)
  // }, [])

  const backClickHandler = () => {
    Router.back()
  }

  return (
    <header>
      {/* <UnnecessarilyComplexTitle loaded={loaded} /> */}
      {backBtn && (
        <a
          role='button'
          tabIndex={0}
          title='Profile'
          aria-label='Profile'
          onClick={backClickHandler}
          onKeyDown={backClickHandler}
          className='float-left'
          style={{ marginTop: '5px' }}
        >
          <ChevronLeft fontSize='inherit' className='back-icon' />
          {/* <p className='back-text'>Back</p> */}
        </a>
      )}
      {title && <h3>{title}</h3>}
      <div className='float-right right-component'>{component}</div>

      <div style={{ flex: 1 }} />

      <nav>
        {/* <ThemeButton />
        <div className='divider' /> */}

        {/* <Link href='/profile'>
          <a title='Profile' aria-label='Profile'>
            <Avatar image='/images/avatar.jpg' />
          </a>
        </Link> */}
      </nav>

      <style jsx>{`
        header {
          padding: 0 var(--gap);
          padding-top: env(safe-area-inset-top) / 2;
          width: 100%;
          height: calc(env(safe-area-inset-top) / 2 + 72px);
          background: var(--base);
          border-bottom: 1px solid var(--divider);
          display: flex;
          align-items: center;
          z-index: 10;
          position: fixed;
          top: 0;
          left: 0;
          transition: var(--transition-colors);
        }
        .back-btn {
          width: 150px;
          height: 100%;
          position: relative;
          display: block;
          margin: 20px;
        }

        .back-icon {
          position: relative;
          display: block;
          margin: 15px;
        }

        .back-text {
          display: inline;
          margin-left: 10px;
          position: absolute;
        }

        header h3 {
          width: 50%;
          margin: auto;
          position: absolute;
          top: calc(env(safe-area-inset-top) / 2 + (72px / 2));
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .back-btn {
          width: 150px;
          height: 100%;
          position: absolute;
          display: block;
          top: calc(env(safe-area-inset-top) / 2 + (72px / 2));
          left: 25px;
        }

        .right-component {
          width: fit-content;
          height: 100%;
          position: absolute;
          display: block;
          margin-top: -10px;
          top: calc(env(safe-area-inset-top) / 2 + (72px / 2));
          right: 25px;
        }

        nav {
          display: flex;
          align-items: center;
          z-index: 4;
        }

        .divider {
          margin: 0 var(--gap);
          width: 1px;
          height: 28px;
          background: var(--divider);
          display: flex;
          transition: var(--transition-colors);
        }
      `}</style>
    </header>
  )
}

export default Header

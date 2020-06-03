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
  leftComponent?: JSX.Element
}

const Header = (props: appbarProps) => {
  const { title, backBtn, component, leftComponent } = props

  const backClickHandler = () => {
    Router.back()
  }

  return (
    <header>
      {backBtn ? (
        <a
          role='button'
          tabIndex={0}
          title='Profile'
          aria-label='Profile'
          onClick={backClickHandler}
          onKeyDown={backClickHandler}
          className='back-btn'
        >
          <ChevronLeft fontSize='inherit' className='back-icon' />
        </a>
      ) : (
        leftComponent && <div className='left-component'>{leftComponent}</div>
      )}
      {title && <h3>{title}</h3>}
      <div className='float-right right-component'>{component}</div>

      <div style={{ flex: 1 }} />
      <style jsx>{`
        header {
          padding: 0 var(--gap);
          padding-top: var(--safe-area-inset-top) / 2;
          width: 100%;
          height: calc(var(--safe-area-inset-top) / 2 + 72px);
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
          width: fit-content;
          height: 45px;
          position: absolute;
          display: block;
          margin-top: -10px;
          top: calc(var(--safe-area-inset-top) / 2 + (72px / 2));
          left: 25px;
        }

        .left-component {
          width: fit-content;
          height: 45px;
          position: absolute;
          display: block;
          margin-top: -10px;
          top: calc(var(--safe-area-inset-top) / 2 + (72px / 2));
          left: 25px;
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
          top: calc(var(--safe-area-inset-top) / 2 + (72px / 2));
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .right-component {
          width: fit-content;
          height: 45px;
          position: absolute;
          display: block;
          margin-top: -10px;
          top: calc(var(--safe-area-inset-top) / 2 + (72px / 2));
          right: 25px;
        }
      `}</style>
    </header>
  )
}

export default Header

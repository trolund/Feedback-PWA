import Router from 'next/router'
import { ChevronLeft } from 'react-feather'

const BackAppHeader = () => {
  const backClickHandler = () => {
    Router.back()
  }

  return (
    <header>
      <nav>
        <a
          role='button'
          tabIndex={0}
          title='Profile'
          aria-label='Profile'
          onClick={backClickHandler}
          onKeyDown={backClickHandler}
          className='float-left'
        >
          <ChevronLeft fontSize='inherit' />
          <p>Back</p>
        </a>
      </nav>

      <style jsx>{`
        header {
          padding: 0 var(--gap);
          padding-top: env(safe-area-inset-top);
          width: 100%;
          height: calc(env(safe-area-inset-top) + 72px);
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

        p {
          margin-bottom: 20px;
          margin-left: 10px;
          display: inline;
          position: absolute;
        }

        nav {
          display: flex;
          align-items: center;
          z-index: 4;
        }
      `}</style>
    </header>
  )
}

export default BackAppHeader

import * as React from 'react'
import { DownloadCloud } from 'react-feather'
import useAddToHomescreenPrompt from '../services/AddToHomescreenService'

const Prompt = () => {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  const [isVisible, setVisibleState] = React.useState(false)

  const hide = () => setVisibleState(false)

  React.useEffect(() => {
    if (prompt) {
      setVisibleState(true)
    }
  }, [prompt])

  if (!isVisible) {
    return <div />
  }

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={hide}
      onKeyDown={hide}
      className='overlay'
    >
      <div className='box'>
        <button type='button' onClick={hide} className='closebtn'>
          Close
        </button>
        <button
          type='button'
          onClick={promptToInstall}
          className='button bottombtn'
        >
          <DownloadCloud
            style={{
              width: '20px',
              height: '20px',
              marginRight: '-20px',
              float: 'left'
            }}
          />
          Installerer app
        </button>
      </div>
      <style jsx>{`
        .closebtn {
          float: right;
          color: var(--accent);
          border: none;
        }
        .overlay {
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-color: var(--base-low);
          position: fixed;
          backdrop-filter: blur(2px);
        }

        .box {
          width: 100%;
          height: 170px;
          position: fixed;
          bottom: 0px;
          left: 0px;
          right: 0px;
          background-color: var(--base);
          padding: 10px;
          box-shadow: -1px -4px 51px -24px rgba(0, 0, 0, 0.75);
        }
      `}</style>
    </div>
  )
}

export default Prompt

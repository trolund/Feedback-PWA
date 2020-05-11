import React, { useState, useEffect, useCallback } from 'react'
import { DownloadCloud, X } from 'react-feather'
import IBeforeInstallPromptEvent from '../../models/types/IBeforeInstallPromptEvent'
import IosShare from '../../../public/images/iosShare.png'

const Prompt = () => {
  const [isVisible, setVisibleState] = useState(false)
  const [isIOSVisible, setIOSVisibleState] = useState(false)
  const [prompt, setState] = useState<IBeforeInstallPromptEvent | null>(null)

  const hide = () => setVisibleState(false)

  const promptToInstall = useCallback(() => {
    if (prompt) {
      return prompt.prompt()
    }
    return Promise.reject(
      new Error(
        'Tried installing before browser sent "beforeinstallprompt" event'
      )
    )
  }, [prompt])

  const isIos = (): boolean => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    return /iphone|ipad|ipod/.test(userAgent)
  }

  const isInStandaloneMode = (): boolean =>
    'standalone' in window.navigator && (window.navigator as any).standalone

  useEffect(() => {
    const ready = (e: IBeforeInstallPromptEvent) => {
      e.preventDefault()
      setState(e)
    }

    if (isIos() && !isInStandaloneMode()) {
      setIOSVisibleState(true)
      setVisibleState(true)
    }

    window.addEventListener('beforeinstallprompt', ready as any)
    return () => {
      window.removeEventListener('beforeinstallprompt', ready as any)
    }
  }, [promptToInstall])

  useEffect(() => {
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
        <span className='closebtn'>
          <X onClick={hide} />
        </span>
        {isIOSVisible ? (
          <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <p>For at installere Opino app gør følgende</p>
            <ol>
              <li>
                Tryk på share knappen
                <img
                  alt='iosShare'
                  style={{ height: '60px', borderRadius: '50%' }}
                  src={IosShare}
                />
              </li>
              <li>Tryk på tilføj til hjemmeskærm</li>
              <li>Tryk tilføj</li>
            </ol>
          </div>
        ) : (
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
        )}
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
          height: fit-content;
          position: fixed;
          bottom: 0px;
          left: 0px;
          right: 0px;
          background-color: var(--base);
          padding: 10px;
          box-shadow: -1px -4px 51px -24px rgba(0, 0, 0, 0.75);
          text-align: center;
        }
      `}</style>
    </div>
  )
}

export default Prompt

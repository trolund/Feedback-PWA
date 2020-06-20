import Lottie from 'react-lottie'
import * as loadingAni from '../../../public/Animations/loading.json'

type loadingprops = {
  loading: boolean
  text?: string
  showOverlay?: boolean
}

const MiddelLoader: React.FC<loadingprops> = ({
  loading,
  text,
  showOverlay
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: (loadingAni as any).default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }
  return (
    <>
      {loading && (
        <div
          className='loading-overlay'
          style={{ display: showOverlay ? 'block' : 'none' }}
        ></div>
      )}
      {loading && (
        <div className='container'>
          <Lottie options={defaultOptions} height={65} width={65} />
          <p style={{ textAlign: 'center' }}>{text || 'Henter...'}</p>
        </div>
      )}
      <style jsx>{`
        .container {
          border-radius: var(--border-radius);
          background-color: var(--accent);
          padding: 25px;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          z-index: 9999;
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.28);
        }

        .loading-overlay {
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
          background-color: var(--loading-overlay);
          position: fixed;
          width: 100vw;
          height: 100vh;
          z-index: 10;
        }
      `}</style>
    </>
  )
}

export default MiddelLoader

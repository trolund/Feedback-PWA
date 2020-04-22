import Lottie from 'react-lottie'
import * as loadingAni from '../../public/Animations/loading.json'

type loadingprops = {
  loading: boolean
}

const MiddelLoader: React.FC<loadingprops> = ({ loading }) => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: (loadingAni as any).default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }
  return (
    <>
      {loading && (
        <div className='container'>
          <Lottie options={defaultOptions} height={65} width={65} />
          <p>Henter...</p>
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
            }
          `}</style>
        </div>
      )}
    </>
  )
}

export default MiddelLoader

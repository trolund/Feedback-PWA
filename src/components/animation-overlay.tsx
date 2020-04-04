import { useState, useEffect } from 'react'
import Lottie from 'react-lottie'

type overlayProps = {
  animation: any
  text: string
  onComplete?: () => void
}

const AnimationOverlay: React.FC<overlayProps> = ({
  animation,
  text,
  onComplete
}) => {
  const [isStopped] = useState(false)
  const [isPaused, setIsPaused] = useState(true)

  useEffect(() => {
    setIsPaused(false)
  }, [])

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animation.default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  return (
    <div className='overlay'>
      <div className='ani'>
        <Lottie
          options={defaultOptions}
          height={300}
          width={300}
          isStopped={isStopped}
          isPaused={isPaused}
          eventListeners={[{ eventName: 'complete', callback: onComplete }]}
        />
        <h3>{text}</h3>
      </div>
      <style jsx>{`
        .ani {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
        }
        h3 {
          margin-left: auto;
          margin-right: auto;
          width: 100%;
          text-align: center;
        }
        .overlay {
          height: 100%;
          position: absolute;
          width: 100%;
          top: 0;
          left: 0;
          z-index: 1000;
          background: var(--base);
        }
      `}</style>
    </div>
  )
}

export default AnimationOverlay

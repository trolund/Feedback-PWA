/* eslint-disable react/destructuring-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
import { useDrag } from 'react-use-gesture'
import { useState, useEffect } from 'react'

type BottomModalProps = {
  show: boolean
  setShow: (state: boolean) => void
  content: JSX.Element
}
const BottomModal = (props: BottomModalProps) => {
  const { content, setShow, show } = props
  const [maxHeight, setMaxHeight] = useState('0px')
  const [bottom, setBottom] = useState('-50vh')
  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ movement: [, my] }) => {
    if (my > 190) {
      setShow(false)
    }
  })

  useEffect(() => {
    setMaxHeight(show ? '95vh' : '0px')
    setBottom(show ? '0' : '-50vh')
  }, [props, show])

  return (
    <div
      className='bottom-modal-ovelay'
      style={{
        position: 'fixed',
        left: 0,
        width: '100%',
        height: '0%',
        zIndex: 10
      }}
      role='button'
      tabIndex={0}
    >
      <div
        className='bottom-modal-container'
        style={{ maxHeight, bottom }}
        {...bind()}
      >
        <div className='content-container'>{content}</div>
        <style jsx>{`
          @media only screen and (min-width: 800px) {
            .bottom-modal-container {
              left: 0 !important;
              transform: none !important;
              max-width: 320px !important;
            }
          }
          .bottom-modal-container {
            padding: 5px;
            height: contain;
            width: 100vw;
            position: fixed;
            background-color: var(--base);
            border-top-right-radius: var(--border-radius);
            border-top-left-radius: var(--border-radius);
            box-shadow: 1px 7px 27px 1px rgba(0, 0, 0, 0.75);
            transition-property: max-height, bottom;
            transition-duration: 1s, 750ms;
            transition-timing-function: ease-in-out;
            z-index: 10;
            bottom: 0;
            padding-bottom: 80px;
            max-width: 600px;
            left: 50%;
            transform: translateX(-50%);
          }

          .bottom-modal-ovelay {
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: 1001;
            left: 0;
            bottom: 0;
          }

          .content-container {
            overflow: scroll;
            max-height: 94vh;
            min-height: 400px;
            padding-bottom: calc(env(safe-area-inset-bottom) + 75px) !important;
          }

           {
            /* .content-container::-webkit-scrollbar {
            width: 11px;
          }

          .content-container {
            scrollbar-width: thin;
            scrollbar-color: var(--label) rgba(0, 0, 0, 0);
          }

          .content-container::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0);
          }

          .content-container::-webkit-scrollbar-thumb {
            background-color: var(--label);
            border-radius: 6px;
            border: 3px solid rgba(0, 0, 0, 0);
          } */
          }
        `}</style>
      </div>
    </div>
  )
}

export default BottomModal

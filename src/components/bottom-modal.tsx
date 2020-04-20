import { useDrag } from 'react-use-gesture'

type BottomModalProps = {
  show: boolean
  setShow: (state: boolean) => void
  content: JSX.Element
}
const BottomModal = ({ show, setShow, content }: BottomModalProps) => {
  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    if (my > 190) {
      setShow(false)
    }
  })
  return (
    <div
      className='bottom-modal-ovelay'
      style={{
        position: 'fixed',
        left: 0,
        width: '100%',
        height: '0%',
        zIndex: 2
      }}
      role='button'
      tabIndex={0}
      //   onKeyDown={() => setShow(false)}
      //   onClick={() => setShow(false)}
    >
      <div
        className='bottom-modal-container'
        style={{
          maxHeight: show ? '94vh' : '0px',
          bottom: show ? '0' : '-50vh'
        }}
        {...bind()}
      >
        <div className='content-container'>{content}</div>
        <style jsx>{`
          .bottom-modal-container {
            padding: 5px;
            height: contain;
            width: 100vw;
            position: fixed;
            background-color: var(--surface);
            border-top-right-radius: var(--border-radius);
            border-top-left-radius: var(--border-radius);
            box-shadow: 1px 7px 27px 1px rgba(0, 0, 0, 0.75);
            transition-property: max-height, bottom;
            transition-duration: 1s, 750ms;
            transition-timing-function: ease-in-out;
            z-index: 10;
            bottom: 0px;
            padding-bottom: 80px;
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
            width: 100%;
            height: 100%;
          }
        `}</style>
      </div>
    </div>
  )
}

export default BottomModal

import Modal from 'react-modal'
import { X, Check } from 'react-feather'

type ConfirmModalProps = {
  titel: string
  content: JSX.Element
  setShow: (show: boolean) => void
  show: boolean
  onConfirm: () => void
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    width: 'fit-content',
    minWidth: '300px',
    height: 'fit-content',
    maxWidth: '100vw',
    maxHeight: '90vh',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    padding: '0px',
    BackgroundColor: 'var(--base)'
  }
}

const CustomConfirmModal = ({
  setShow,
  show,
  content,
  titel,
  onConfirm
}: ConfirmModalProps) => {
  return (
    <Modal
      isOpen={show}
      onRequestClose={() => setShow(false)}
      style={customStyles}
      contentLabel='Example Modal'
      className='modal'
      overlayClassName='Overlay'
      ariaHideApp={false}
    >
      <X type='button' className='close-modal' onClick={() => setShow(false)} />
      <h3>{titel}</h3>
      <div className='content'>{content}</div>
      <div className='actions'>
        <button
          type='button'
          data-cy='cancel-btn'
          className='button float-left'
          onClick={() => setShow(false)}
        >
          <X
            style={{
              marginBottom: '-5px',
              marginRight: '5px',
              height: '20px',
              width: '20px'
            }}
          />{' '}
          Annuller
        </button>
        <button
          data-cy='ok-btn'
          type='button'
          className='button float-right'
          onClick={() => {
            onConfirm()
            setShow(false)
          }}
        >
          <Check
            style={{
              marginBottom: '-5px',
              marginRight: '5px',
              height: '20px',
              width: '20px'
            }}
          />{' '}
          Bekræfte
        </button>
      </div>
      <style jsx>{`
        h3 {
          padding: var(--gap-small);
        }

        .content {
          padding: var(--gap-small);
          text-align: center;
        }
        .actions {
          width: 100%;
          background-color: var(--surface);
          padding: var(--gap-small);
          height: 75px;
          border-bottom-right-radius: var(--border-radius);
          border-bottom-left-radius: var(--border-radius);
        }
      `}</style>
    </Modal>
  )
}

export default CustomConfirmModal

import { ToastContainer, toast } from 'react-toastify'

type initState = {}

const CustomToast = () => {
  return (
    <>
      <ToastContainer
        className='toast-container'
        progressClassName='toast-progress'
        bodyClassName='toast-body'
        toastClassName='toast'
        position={toast.POSITION.BOTTOM_RIGHT}
      />
      <style jsx global>{`
        @media only screen and (max-width: 480px) {
          .toast-container {
            bottom: calc(env(safe-area-inset-bottom) + 75px) !important;
          }
        }

        .toast-body {
          color: var(--text) !important;
        }

        .toast {
          background: var(--overlay);
          backdrop-filter: blur(1px);
        }

        .toast-container {
          bottom: calc(env(safe-area-inset-bottom) + 75px) !important;
        }

        .toast-progress {
          color: var(--accent);
          background: var(--accent);
        }
      `}</style>
    </>
  )
}

export default CustomToast

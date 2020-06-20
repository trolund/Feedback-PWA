import { ToastContainer, toast } from 'react-toastify'

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
         {
          /* @media only screen and (max-width: 480px) {
          .toast-container {
            bottom: calc(env(safe-area-inset-bottom) + 75px) !important;
          }
        } */
        }

        .toast-body {
          color: var(--text) !important;
        }

        .toast {
          background: var(--base);
        }

        .toast-container {
          bottom: calc(
            var(--safe-area-inset-bottom) + var(--bottom-bar-space)
          ) !important;
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

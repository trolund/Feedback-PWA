import { ToastContainer, toast } from 'react-toastify'

type initState = {}

const CustomToast = () => {
  return (
    <>
      <ToastContainer
        className='toast-container'
        // toastClassName='dark-toast'
        progressClassName='toast-progress'
        position={toast.POSITION.BOTTOM_RIGHT}
      />
      <style jsx>{`
        .toast-container {
          background-color: var(--base);
        }

        .toast-progress {
          color: var(--accent);
          background-color: var(--accent);
        }
      `}</style>
    </>
  )
}

export default CustomToast

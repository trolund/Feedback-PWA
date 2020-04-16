import * as React from 'react'
import useAddToHomescreenPrompt from '../services/AddToHomescreenService'

const Prompt = () => {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  const [isVisible, setVisibleState] = React.useState(false)

  const hide = () => setVisibleState(false)

  React.useEffect(() => {
    if (prompt) {
      setVisibleState(true)
    }
  }, [prompt])

  if (!isVisible) {
    return <div />
  }

  return (
    <div role='button' tabIndex={0} onClick={hide} onKeyDown={hide}>
      <button type='button' onClick={hide} className='button'>
        Close
      </button>
      Hello! Wanna add to homescreen?
      <button type='button' onClick={promptToInstall} className='button'>
        Add to homescreen
      </button>
    </div>
  )
}

export default Prompt

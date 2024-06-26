import { useState } from 'react'
import { getLightMode, toggleLightMode } from '../utils/theme'

const ThemeButton = () => {
  const [dark, setDark] = useState(getLightMode())

  function toggle() {
    const newVal = !dark
    setDark(newVal)
    toggleLightMode()
  }

  return (
    <button type='button' onClick={toggle}>
      {!dark ? 'Lyst' : 'Mørkt'} mode
      <style jsx>{`
        button {
          color: var(--label);
          font-size: 14px;
          background: transparent;
          display: flex;
          align-items: center;
          border: none;
          outline: none;
          cursor: pointer;
          transition: var(--transition-colors);
        }

        button:hover,
        button:focus {
          color: var(--fg);
        }
      `}</style>
    </button>
  )
}

export default ThemeButton

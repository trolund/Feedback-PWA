import { useState, useCallback } from 'react'
import { Check } from 'react-feather'

type initState = {
  checked: boolean
  label: string
  noLabel?: boolean
  onChange?: (checked: boolean) => void
}

const CustomCheckbox = (props: initState) => {
  const { checked, label, onChange, noLabel } = props
  const [state, setState] = useState(checked)
  let showLabel = false
  if (noLabel !== null) {
    showLabel = noLabel
  }

  const color = useCallback(
    () => (state ? 'var(--accent)' : 'var(--surface)'),
    [state]
  )

  return (
    <div
      className='container'
      role='button'
      tabIndex={0}
      onKeyDown={() => {
        const newVal = !state
        setState(newVal)
        onChange(newVal)
      }}
      onClick={() => {
        const newVal = !state
        setState(newVal)
        onChange(newVal)
      }}
    >
      <div className='box' style={{ backgroundColor: color() }}>
        {state && <Check color='whitesmoke' className='checkmark' />}
      </div>

      <label htmlFor='box'>{label}</label>
      <style jsx>{`
        .container {
          width: fit-content;
          max-width: ${showLabel ? '25px' : '250px'};
          text-align: center;
        }
        .box {
          background-color: var(--surface);
          width: 25px;
          height: 25px;
          padding: 1px;
          border-radius: 5px;
          float: left;
        }
        .checkmark {
        }
        label {
          line-height: 25px;
          margin-left: 10px;
        }
      `}</style>
    </div>
  )
}

export default CustomCheckbox

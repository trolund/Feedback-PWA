import { useState, useEffect } from 'react'
import { Check } from 'react-feather'

type initState = {
  checked: boolean
  label: string
  onChange?: (checked: boolean) => void
}

const CustomCheckbox = (props: initState) => {
  const { checked, label, onChange } = props
  const [state, setState] = useState(checked)

  useEffect(() => {
    if (onChange) onChange(state)
  }, [onChange, state])

  return (
    <div
      className='container'
      role='button'
      tabIndex={0}
      onKeyDown={() => setState(!state)}
      onClick={() => setState(!state)}
    >
      <div
        className='box'
        style={state ? { backgroundColor: 'var(--accent)' } : {}}
      >
        {state && <Check color='whitesmoke' className='checkmark' />}
      </div>

      <label htmlFor='box'>{label}</label>
      <style jsx>{`
        .container {
          width: auto;
          max-width: 250px;
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

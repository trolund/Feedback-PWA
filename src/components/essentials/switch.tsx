type SwitchProps = {
  value: boolean
  setValue: (newVal: Boolean) => void
}

const Switch = ({ setValue, value }: SwitchProps) => {
  function toggle() {
    setValue(!value)
  }

  return (
    <button type='button' onClick={toggle}>
      {value ? 'Ja' : 'Nej'} mode
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

export default Switch

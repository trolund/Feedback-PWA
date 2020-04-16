type Props = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  logo: JSX.Element
  type: string
  className?: string
  center?: boolean
  error?: boolean
}

const CustomInput = ({
  placeholder,
  value,
  onChange,
  logo: Logo,
  type,
  className,
  center,
  error
}: Props) => {
  console.log('====================================')
  console.log(error)
  console.log('====================================')
  return (
    <div className={className ?? ''} style={{ width: 'fit-content' }}>
      <input
        className={error ? 'input-error' : ''}
        type={type}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        value={value}
        style={center ? { textAlign: 'center' } : {}}
      />
      <div className='icon-container'>
        <div className='icon'>{Logo}</div>
      </div>

      <style jsx>{`
        .icon-container {
          border-top-left-radius: var(--border-radius);
          border-bottom-left-radius: var(--border-radius);
          height: 52px;
          background-color: #8a8b8e4f;
          max-width: 45px;
          margin-top: -52px;
          margin-left: 0px;
        }

        .icon {
          height: 20px;
          width: 20px;
          padding: 15px;
          padding-left: 12px;
        }
        input {
          padding-left: 55px;
        }

        .input-error {
          box-shadow: 0 0 0 2px var(--error) !important;
        }
      `}</style>
    </div>
  )
}

export default CustomInput

type Props = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  logo?: JSX.Element
  type: string
  className?: string
  id?: string
  center?: boolean
  error?: boolean
  fill?: boolean
}

const CustomInput = ({
  placeholder,
  value,
  onChange,
  logo: Logo,
  type,
  className,
  center,
  error,
  fill,
  id
}: Props) => {
  const fillSpace = fill ? { width: '100%' } : {}
  const LogoPadding = Logo ? { paddingLeft: '55px' } : { paddingLeft: '15px' }
  return (
    <div
      className={className ?? ''}
      style={{
        width: fill ? '100%' : 'fit-content',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    >
      <input
        id={id ?? ''}
        className={error ? 'input-error' : ''}
        type={type}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        value={value}
        style={
          center
            ? { textAlign: 'center', ...fillSpace, ...LogoPadding }
            : { ...fillSpace, ...LogoPadding }
        }
      />
      {Logo !== undefined && (
        <div className='icon-container'>
          <div className='icon'>{Logo}</div>
        </div>
      )}

      <style jsx>{`
        .icon-container {
          border-top-left-radius: var(--border-radius);
          border-bottom-left-radius: var(--border-radius);
          height: 45px;
          background-color: #8a8b8e4f;
          max-width: 45px;
          margin-top: -45px;
          margin-left: 0px;
        }

        .icon {
          height: 20px;
          width: 20px;
          padding: 13px;
          padding-left: 12px;
        }

        .input-error {
          box-shadow: 0 0 0 2px var(--error) !important;
        }
      `}</style>
    </div>
  )
}

export default CustomInput

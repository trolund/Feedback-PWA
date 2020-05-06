type Props = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  center?: boolean
  error?: boolean
  fill?: boolean
}

const CustomTextarea = ({
  placeholder,
  value,
  onChange,
  className,
  center,
  error,
  fill
}: Props) => {
  const fillSpace = fill ? { width: '100%' } : {}
  return (
    <div
      className={className ?? ''}
      style={{
        width: fill ? '100%' : 'fit-content',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    >
      <textarea
        className={error ? 'input-error' : ''}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        value={value}
        style={
          center ? { textAlign: 'center', ...fillSpace } : { ...fillSpace }
        }
      />
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

export default CustomTextarea

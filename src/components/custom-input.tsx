type Props = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  logo: React.Component
}

export default ({ placeholder, value, onChange, logo: Logo }: Props) => {
  return (
    <>
      <input
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        value={value}
      />
      <div className='icon'>{Logo}</div>

      <style jsx>{`
        .icon {
          margin-top: -25px;
        }
        input {
          padding-left: 50px;
        }
      `}</style>
    </>
  )
}

import DatePicker from 'react-mobile-datepicker'
import { Clock } from 'react-feather'
import { useState, useEffect } from 'react'

type Props = {
  onChange: (data: Date) => void
  value: Date
  error?: boolean
}

const CustomTimepicker = ({ value, onChange, error }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dateValue, setDateValue] = useState(value)

  useEffect(() => {
    setDateValue(value)
  }, [value])

  return (
    <>
      <div
        role='button'
        tabIndex={0}
        className='container'
        onKeyDown={() => setIsOpen(!isOpen)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          readOnly
          value={dateValue
            .toTimeString()
            .split(' ')[0]
            .slice(0, 5)}
          style={{ paddingLeft: '50px' }}
        />
        <Clock
          style={{
            marginTop: '-33px',
            position: 'absolute',
            marginLeft: '15px'
          }}
        />
      </div>
      <DatePicker
        // theme='ios'
        className={error ? 'input-error' : ''}
        confirmText='Ok'
        cancelText='Luk'
        isOpen={isOpen}
        value={dateValue}
        onChange={(date: Date) => {
          setDateValue(date)
          onChange(date)
        }}
        onSelect={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        headerFormat='hh:mm'
        dateConfig={{
          hour: {
            format: 'hh',
            caption: 'Hour',
            step: 1
          },
          minute: {
            format: 'mm',
            caption: 'Min',
            step: 1
          }
        }}
      />

      <style jsx>{`
        .input-error {
          box-shadow: 0 0 0 2px var(--error) !important;
        }
        .container input {
          border-radius: var(--border-radius);
          width: 110px;
          color: var(--text);
          padding: var(--gap-small);
          background: var(--base);
          display: flex;
          align-items: center;
          transition: var(--transition-colors);
          border-color: var(--label);
          border: 1px solid;
          border-radius: 15px;
          background-color: var(--surface);
          user-select: none;
        }

        .container input:hover {
          background-color: var(--surface-hover);
        }
        .container {
          width: 110px;
          user-select: none;
        }

        .container :global(> svg) {
          width: 20px;
          height: 20px;
        }
      `}</style>
    </>
  )
}

export default CustomTimepicker

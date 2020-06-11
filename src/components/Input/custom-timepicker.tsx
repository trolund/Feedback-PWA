import DatePicker from 'react-mobile-datepicker'
import { Clock } from 'react-feather'
import { useState, useEffect } from 'react'

type Props = {
  onChange: (data: Date) => void
  value: Date
  error?: boolean
  minValue?: Date
  maxValue?: Date
}

const CustomTimepicker = ({
  value,
  onChange,
  error,
  minValue,
  maxValue
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dateValue, setDateValue] = useState(value)

  useEffect(() => {
    setDateValue(value)
  }, [value])

  const minProp = minValue !== null ? { min: minValue } : {}
  const maxProp = maxValue !== null ? { max: maxValue } : {}

  return (
    <>
      <div className='container'>
        <input
          className={error ? 'input-error input' : 'input'}
          readOnly
          value={dateValue
            .toTimeString()
            .split(' ')[0]
            .slice(0, 5)}
          role='button'
          tabIndex={0}
          onKeyDown={() => setIsOpen(!isOpen)}
          onClick={() => setIsOpen(!isOpen)}
        />
        <Clock
          style={{
            height: '84px',
            maxWidth: '45px',
            marginTop: '-70px',
            marginLeft: '15px'
          }}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <DatePicker
        {...minProp}
        {...maxProp}
        // theme='ios'
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
          padding: 16px 16px 16px 16px;
          padding-left: 50px;
          background: var(--base);
          display: flex;
          align-items: center;
          transition: var(--transition-colors);
          border: 0px solid;
          background-color: var(--surface);
          box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
            rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
          outline: 0px;
        }

        .container {
          width: 110px;
          user-select: none;
          margin-bottom: -20px;
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

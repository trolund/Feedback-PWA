import DatePicker from 'react-mobile-datepicker'
import { Calendar } from 'react-feather'
import { useState, useEffect } from 'react'

type Props = {
  onChange: (data: Date) => void
  value: Date
}

const CustomDatepicker = ({ value, onChange }: Props) => {
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
          value={dateValue.toLocaleDateString()}
          style={{ paddingLeft: '50px' }}
        />
        <Calendar
          style={{
            marginTop: '-33px',
            position: 'absolute',
            marginLeft: '15px'
          }}
        />
      </div>
      <DatePicker
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
        headerFormat='DD/MM/YYYY'
        dateConfig={{
          date: {
            format: 'D',
            caption: 'Day',
            step: 1
          },
          month: {
            format: 'M',
            caption: 'Mon',
            step: 1
          },
          year: {
            format: 'YYYY',
            caption: 'Year',
            step: 1
          }
        }}
      />

      <style jsx>{`
        .container input {
          border-radius: var(--border-radius);
          width: 160px;
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
          width: 160px;
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

export default CustomDatepicker

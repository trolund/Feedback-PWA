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
      <div className='container'>
        <input
          value={dateValue.toLocaleDateString()}
          style={{ paddingLeft: '50px' }}
          // onChange={e => onChange(new Date(e.target.value))}
          readOnly
        />
        <Calendar
          style={{
            marginTop: '-37px',
            position: 'absolute',
            marginLeft: '15px'
          }}
          role='button'
          tabIndex={0}
          onKeyDown={() => setIsOpen(!isOpen)}
          onClick={() => setIsOpen(!isOpen)}
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
          padding: 16px 16px 16px 16px;
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

         {
          /* .container input:hover {
          background-color: var(--surface-hover);
        } */
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

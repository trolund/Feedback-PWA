import { ChevronDown } from 'react-feather'
import IOptionsValue from '../models/OptionsValue'

type Props = {
  placeholder?: string
  values: IOptionsValue[]
  onChange: (value: string) => void
  className?: string
  center?: boolean
  error?: boolean
  fill?: boolean
  defaultValue?: string | number | null
}

const CustomSelect = ({
  placeholder,
  values,
  onChange,
  center,
  error,
  fill,
  defaultValue
}: Props) => {
  const fillSpace = fill ? { width: '100%' } : { width: 'fit-content' }
  return (
    <div
      className='select-css'
      style={{
        ...fillSpace,
        textAlign: center ? 'center' : 'left',
        boxShadow: error ? '0 0 0 2px var(--error) !important' : 'none'
      }}
    >
      <select
        value={defaultValue}
        name='select'
        style={{ zIndex: 2, fontWeight: 300 }}
        onChange={e => {
          onChange(e.target.value)
        }}
      >
        {placeholder && <option value='null'>{placeholder}</option>}
        {values.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <span className='arrow'>
        <ChevronDown />
      </span>

      <style jsx>{`
        .arrow {
          float: right;
          margin-left: -40px;
          margin-top: 3px;
          z-index: 1;
        }
        .select-css {
          z-index: 10;
          display: block;
          color: #444;
          line-height: 1.3;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          margin: 0;
          border: 1px;

          /* box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04); */

          appearance: none;
          border: 0px !important;
          color: var(--text);
          background: var(--base);
          display: flex;
          align-items: center;
          transition: var(--transition-colors);
          border-color: var(--divider);
          border-radius: var(--border-radius);
          background-color: var(--surface);
          display: -ms-flexbox;
          /* IE10 */
          display: flex;
          font-size: inherit;
          font-family: inherit;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
            rgba(0, 0, 0, 0.06) 0px 1px 2px 0px !important;
          -webkit-appearance: none;
          margin: 0px;
          border-width: 0px;
          border-style: initial;
          border-color: initial;
        }

        .select-css select {
          width: 100%;
          padding: 15px;
        }

        .select-css::-ms-expand {
          display: none;
        }

        .select-css:hover {
          border-color: #888;
        }

         {
          /* .select-css:focus {
          border-color: #aaa;
          box-shadow: 0 0 1px 3px rgba(59, 153, 252, 0.7);
          box-shadow: 0 0 0 3px -moz-mac-focusring;
          color: #222;
          outline: none;
        } */
        }

        .select-css option {
           {
            /* font-weight: normal; */
          }
        }

        /* Support for rtl text, explicit support for Arabic and Hebrew */
        *[dir='rtl'] .select-css,
        :root:lang(ar) .select-css,
        :root:lang(iw) .select-css {
          background-position: left 0.7em top 50%, 0 0;
          padding: 0.6em 0.8em 0.5em 1.4em;
        }

        .select-css:disabled:hover,
        .select-css[aria-disabled='true'] {
          border-color: #aaa;
        }

        .select-css select:focus {
          background-color: none;
          border-radius: var(--border-radius);
          outline: 0px;
          box-sizing: border-box;
          box-shadow: 0 0 0 2px var(--accent);
        }
      `}</style>
    </div>
  )
}

export default CustomSelect

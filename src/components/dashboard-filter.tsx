import { observer } from 'mobx-react-lite'
import { useState, useContext, useEffect } from 'react'
import Select from 'react-select'
// import DatePicker from 'react-datepicker'
// import DatePicker from 'react-mobile-datepicker'
import { FileText } from 'react-feather'
import makeAnimated from 'react-select/animated'
import dashboardStore from '../stores/dashboard-store'
import Tag from '../models/tag'
import CustomDatepicker from './custom-datepicker'
import CustomCheckbox from './checkbox'

const DashboardFilter = observer(() => {
  const [searchWord, setSearchWord] = useState('')
  const [onlyOwnData, setonlyOwnData] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [tags, setTags] = useState([] as Tag[])
  const [startdateIsOpen, setstartdateIsOpen] = useState(false)
  const context = useContext(dashboardStore)

  useEffect(() => {
    context.fetchDashboard(
      startDate,
      endDate,
      tags.map(i => i.value),
      searchWord
    )
  }, [searchWord, startDate, endDate, context, tags])

  const getData = () => {
    context.fetchDashboard(
      startDate,
      endDate,
      tags.map(i => i.value),
      searchWord
    )
  }

  const animatedComponents = makeAnimated()

  // const Countries = [
  //   { label: 'Albania', value: 'Albania' },
  //   { label: 'Argentina', value: 54 },
  //   { label: 'Austria', value: 43 },
  //   { label: 'Cocos Islands', value: 61 },
  //   { label: 'Kuwait', value: 965 },
  //   { label: 'Sweden', value: 46 },
  //   { label: 'Venezuela', value: 58 }
  // ]

  return (
    <div>
      <h4>Filter muligheder</h4>
      <CustomCheckbox
        label='Hvis feedback fra mine møder.'
        checked={onlyOwnData}
        onChange={checked => setonlyOwnData(checked)}
      />
      <div className='card-body'>
        <h5 className='card-title'>Søge ord</h5>
        <div className='card-text'>
          <input
            type='text'
            name='searchWord'
            id='name'
            placeholder="Ord som enden er en del af navnet eller beskrivelse på mødet, fx 'HR' "
            value={searchWord}
            onChange={e => setSearchWord(e.target.value)}
          />
          <div className='tagdiv'>
            <h5 className='card-title'>Kategori</h5>
            <Select options={tags} isMulti components={animatedComponents} />
            {/* <TagInput tags={tags} setTags={setTags} /> */}
          </div>
          <div className='flex-container padding'>
            <div>
              <p>Start dato</p>
              <CustomDatepicker
                value={startDate}
                onChange={date => {
                  setStartDate(date)
                }}
              />
            </div>
            <div>
              {' '}
              <p>Slut dato</p>
              <CustomDatepicker
                value={startDate}
                onChange={date => {
                  setStartDate(date)
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='card-footer text-muted'>
        <a
          role='button'
          tabIndex={0}
          className='button float-right'
          onClick={getData}
          onKeyDown={getData}
        >
          Filter data
        </a>
        <a
          role='button'
          tabIndex={0}
          className='button float-left'
          onClick={getData}
          onKeyDown={getData}
        >
          <FileText width={15} height={15} /> Export
        </a>
      </div>
      <style jsx>{`
        .padding {
          padding-top: 20px;
          padding-bottom: 20px;
        }
        .tagdiv {
          padding-top: 10px;
          padding-bottom: 10px;
        }

        .checkbox {
          float: right;
          font-size: 0.7em;
          margin-top: auto;
          margin-bottom: auto;
        }
      `}</style>
    </div>
  )
})

export default DashboardFilter

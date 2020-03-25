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
      <h3>Filter muligheder</h3>
      <div className='float-right ownData'>
        <CustomCheckbox
          label='Hvis kun min feedback'
          checked={onlyOwnData}
          onChange={checked => setonlyOwnData(checked)}
        />
      </div>
      <div className='flex-container'>
        <div style={{ width: '250px' }}>
          <p>Søgeord</p>
          <input
            type='text'
            name='searchWord'
            id='name'
            placeholder="Ord som enden er en del af navnet eller beskrivelse på mødet, fx 'HR' "
            value={searchWord}
            onChange={e => setSearchWord(e.target.value)}
          />
        </div>
        <div style={{ width: '250px' }}>
          <div className='tagdiv'>
            <p>Kategori</p>
            <Select options={tags} isMulti components={animatedComponents} />
            {/* <TagInput tags={tags} setTags={setTags} /> */}
          </div>
        </div>
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
          <p>Slut dato</p>
          <CustomDatepicker
            value={endDate}
            onChange={date => {
              setEndDate(date)
            }}
          />
        </div>
      </div>
      <div className=''>
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
        .ownData {
          margin-top: -30px;
        }
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

import { observer } from 'mobx-react-lite'
import { useState, useContext, useEffect } from 'react'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import makeAnimated from 'react-select/animated'
import dashboardStore from '../stores/dashboard-store'

interface Tag {
  label: string
  value: string
}

const DashboardFilter = observer(() => {
  const [searchWord, setSearchWord] = useState('')
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
    <div className='card'>
      <h5 className='card-header'>
        Filter muligheder{' '}
        <div className='checkbox'>
          <label htmlFor='own-data'>
            <input type='checkbox' id='own-data' /> Hvis kun min data
          </label>
        </div>
      </h5>
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
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
          />
          <DatePicker
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
          />

          {/* <ReactDatePicker
            showTimeSelect
            timeFormat='HH:mm'
            timeIntervals={15}
            timeCaption='time'
            dateFormat='MMMM d, yyyy h:mm aa'
            className='datetime'
            value={startDate.toISOString()}
            onChange={e => {
              if (e) setStartDate(e)
            }}
          /> */}

          {/* <ReactDatePicker
            showTimeSelect
            timeFormat='HH:mm'
            timeIntervals={15}
            timeCaption='time'
            dateFormat='MMMM d, yyyy h:mm aa'
            className='datetime'
            value={endDate.toISOString()}
            onChange={e => {
              if (e) setEndDate(e)
            }}
          /> */}
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
          Export
        </a>
      </div>
      <style jsx>{`
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

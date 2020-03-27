import { observer } from 'mobx-react-lite'
import { useContext, useEffect } from 'react'
import Select from 'react-select'
// import DatePicker from 'react-datepicker'
// import DatePicker from 'react-mobile-datepicker'
import { FileText } from 'react-feather'
import makeAnimated from 'react-select/animated'
import dashboardStore from '../stores/dashboard-store'
// import Tag from '../models/tag'
import CustomDatepicker from './custom-datepicker'
import CustomCheckbox from './checkbox'
import categoriesStore from '../stores/CategoriesStore'
import authService from '../stores/api/authService'

const DashboardFilter = observer(() => {
  // const [searchWord, setSearchWord] = useState('')
  // const [onlyOwnData, setonlyOwnData] = useState(false)
  // const [startDate, setStartDate] = useState(new Date())
  // const [endDate, setEndDate] = useState(new Date())
  // const [tags, setTags] = useState([] as Tag[])
  const {
    startdate,
    enddate,
    cutoff,
    ownData,
    searchWord,
    tags,
    setCutOff,
    setOwnData,
    setEnddate,
    setSearchWord,
    setStartdate,
    setTags
  } = useContext(dashboardStore)

  const context = useContext(dashboardStore)
  const categoriesContext = useContext(categoriesStore)

  useEffect(() => {
    context.fetchDashboardDate(startdate, enddate, tags, searchWord)
    categoriesContext.fetchCategories(String(authService.getCompanyId()))
  }, [searchWord, tags, startdate, enddate, context, categoriesContext])

  const getData = () => {
    context.fetchDashboardDate(startdate, enddate, tags, searchWord)
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
          checked={ownData}
          onChange={checked => setOwnData(checked)}
        />
      </div>
      <div className='float-right ownData'>
        <CustomCheckbox
          label='Hvis kun relevant data'
          checked={cutoff}
          onChange={checked => setCutOff(checked)}
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
            <Select
              options={categoriesContext?.categories?.map(cat => ({
                label: cat.name,
                value: cat.name
              }))}
              isMulti
              components={animatedComponents}
              onChange={tag => setTags(tag?.map(item => item.value))}
            />
            {/* <TagInput tags={tags} setTags={setTags} /> setTags(tag?.map(item => item.name))*/}
          </div>
        </div>
      </div>
      <div className='flex-container padding'>
        <div>
          <p>Start dato</p>
          <CustomDatepicker
            value={startdate}
            onChange={date => {
              setStartdate(date)
            }}
          />
        </div>
        <div>
          <p>Slut dato</p>
          <CustomDatepicker
            value={enddate}
            onChange={date => {
              setEnddate(date)
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

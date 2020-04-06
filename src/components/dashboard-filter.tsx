import { observer } from 'mobx-react-lite'
import { useContext, useEffect } from 'react'
import { FileText } from 'react-feather'
import dashboardStore from '../stores/dashboard-store'
// import Tag from '../models/tag'
import CustomDatepicker from './custom-datepicker'
import CustomCheckbox from './checkbox'
import categoriesStore from '../stores/CategoriesStore'
import authService from '../stores/api/authService'
import CategoriesPicker from './categories-picker'

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

  return (
    <div>
      <h3>Filter muligheder</h3>
      <div className='flex-container'>
        <div>
          <p>Søgeord</p>
          <input
            type='search'
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
            <CategoriesPicker
              categories={categoriesContext?.categories}
              setTags={selectedTags =>
                setTags(selectedTags.map(item => item.value))
              }
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
      <div className='flex-container padding'>
        <div className='ownData'>
          <CustomCheckbox
            label='Hvis kun min feedback'
            checked={ownData}
            onChange={checked => setOwnData(checked)}
          />
        </div>
        <div className='ownData'>
          <CustomCheckbox
            label='Hvis kun relevant data'
            checked={cutoff}
            onChange={checked => setCutOff(checked)}
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
          padding: 5px;
        }
        .padding {
          padding-top: 20px;
          padding-bottom: 20px;
        }
        .tagdiv {
          padding-top: 10px;
          padding-bottom: 10px;
        }

         {
          /* .checkbox {
          float: right;
          font-size: 0.7em;
          margin-top: auto;
          margin-bottom: auto;
        } */
        }
      `}</style>
    </div>
  )
})

export default DashboardFilter

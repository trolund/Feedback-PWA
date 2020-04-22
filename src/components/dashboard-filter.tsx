import { observer } from 'mobx-react-lite'
import { useContext, useEffect } from 'react'
import { RefreshCw, DownloadCloud, Search, X } from 'react-feather'
import CustomDatepicker from './custom-datepicker'
import CustomCheckbox from './checkbox'
import CategoriesPicker from './categories-picker'
import FetchStates from '../stores/requestState'
import DashboardExcelDownload from './excelExport'
import GraphXScale from '../models/GraphXScale'
import { getCompanyId } from '../services/authService'
import CustomInput from './custom-input'
import rootStore from '../stores/RootStore'

const DashboardFilter = observer(() => {
  // const [searchWord, setSearchWord] = useState('')
  // const [onlyOwnData, setonlyOwnData] = useState(false)
  // const [startDate, setStartDate] = useState(new Date())
  // const [endDate, setEndDate] = useState(new Date())
  // const [tags, setTags] = useState([] as Tag[])
  const {
    dashboardStore: {
      startdate,
      enddate,
      cutoff,
      ownData,
      searchWord,
      tags,
      setOwnData,
      setCutOff,
      setEnddate,
      setSearchWord,
      setStartdate,
      setTags,
      setFixedYAxis,
      useFixedYAxis,
      setSkipZero,
      useSkipZero,
      data,
      fetchDashboardDate,
      setXAxisScale,
      xAxisScale,
      setShowFilter,
      showFilter
    },
    categoriesStore,
    authStore: { isAdmin, isVAdmin }
  } = useContext(rootStore)

  // const context = useContext(dashboardStore)
  // const categoriesContext = useContext(categoriesStore)
  // const { isAdmin, isVAdmin } = useContext(authStore)

  useEffect(() => {
    fetchDashboardDate(startdate, enddate, tags, searchWord, ownData)
    categoriesStore.fetchCategories(String(getCompanyId()))
  }, [
    searchWord,
    tags,
    startdate,
    enddate,
    categoriesStore,
    fetchDashboardDate,
    ownData
  ])

  const getData = () => {
    fetchDashboardDate(startdate, enddate, tags, searchWord, ownData)
  }

  return (
    <ul>
      <li>
        <h3 className='float-left'>Filter muligheder</h3>
        <span className='float-right btn-group'>
          <span>
            <DashboardExcelDownload
              data={data}
              downloadBtn={
                <DownloadCloud style={{ width: '20px', height: '20px' }} />
              }
            />
          </span>
          <span>
            <RefreshCw
              style={{ width: '20px', height: '20px' }}
              onClick={getData}
            />
          </span>
          <span>
            <X
              style={{ width: '20px', height: '20px' }}
              onClick={() => setShowFilter(!showFilter)}
            />
          </span>
        </span>
      </li>

      <li>
        <CustomInput
          logo={<Search style={{ width: '20px', height: '20px' }} />}
          type='search'
          className='fill'
          placeholder="Ord som enden er en del af navnet eller beskrivelse på mødet, fx 'HR' "
          value={searchWord}
          fill
          onChange={e => setSearchWord(e)}
        />
      </li>
      <li>
        {/* <Select
          className='basic-single fill'
          classNamePrefix='select'
          options={
            [
              { label: 'Uger', value: String(Number(GraphXScale.weeks)) },
              { label: 'Måneder', value: String(Number(GraphXScale.mounths)) }
            ] as OptionsValue[]
          }
          onChange={(value: OptionsValue) => setXAxisScale(Number(value.value))}
          // defaultValue={() =>
          //   xAxisScale === GraphXScale.weeks
          //     ? [{ label: 'Uger', value: String(Number(GraphXScale.weeks)) }]
          //     : [
          //         {
          //           label: 'Måneder',
          //           value: String(Number(GraphXScale.mounths))
          //         }
          //       ]
          // }
        /> */}
        <select
          value={xAxisScale}
          onChange={e => setXAxisScale(Number(e.target.value))}
        >
          <option value={GraphXScale.mounths}>Måneder</option>
          <option value={GraphXScale.weeks}>Uger</option>
        </select>
      </li>
      <li className='tagdiv'>
        <CategoriesPicker
          loading={categoriesStore.state === FetchStates.LOADING}
          categories={categoriesStore?.categories}
          setTags={selectedTags =>
            setTags(selectedTags.map(item => item.value))
          }
        />
        {/* <TagInput tags={tags} setTags={setTags} /> setTags(tag?.map(item => item.name))*/}
      </li>
      <li className='flex-container padding'>
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
      </li>

      {(isAdmin || isVAdmin) && (
        <li className='ownData text-center'>
          <CustomCheckbox
            label='Hvis kun min feedback'
            checked={ownData}
            onChange={checked => setOwnData(checked)}
          />
        </li>
      )}
      <li className='ownData'>
        <CustomCheckbox
          label='Hvis kun relevant data'
          checked={cutoff}
          onChange={checked => setCutOff(checked)}
        />
      </li>
      <li className='ownData'>
        <CustomCheckbox
          label='Statisk Y-akse'
          checked={useFixedYAxis}
          onChange={checked => setFixedYAxis(checked)}
        />
      </li>
      <li className='ownData'>
        <CustomCheckbox
          label='Vis kun perioder med registreret aktiviteter'
          checked={useSkipZero}
          onChange={checked => setSkipZero(checked)}
        />
      </li>

      {/* <div className=''>
        <a
          role='button'
          tabIndex={0}
          className='button float-right'
          onClick={getData}
          onKeyDown={getData}
        >
          <RefreshCw style={{ width: '20px', height: '20px' }} />
          Reload
        </a>
      </div> */}
      <style jsx>{`
        li {
          color: var(--fg);
          padding: var(--gap-small);
          display: flex;
          align-items: center;
          transition: var(--transition-colors);
        }

        li:not(:last-child) {
          border-bottom: 1px solid var(--divider);
        }

        .fill {
          width: 100%;
        }

        .btn-group {
          right: 15px;
          position: absolute;
        }

        .btn-group > span {
          margin-left: 10px;
          padding: 5px;
        }

         {
          /* .ownData {
          padding: 5px;
        }
        .padding {
          padding-top: 20px;
          padding-bottom: 20px;
        }
        .tagdiv {
          padding-top: 10px;
          padding-bottom: 10px;
        } */
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
    </ul>
  )
})

export default DashboardFilter

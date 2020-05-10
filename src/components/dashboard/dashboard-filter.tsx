import { observer } from 'mobx-react-lite'
import { useContext, useEffect } from 'react'
import { RefreshCw, DownloadCloud, Search, X } from 'react-feather'
import CustomDatepicker from '../Input/custom-datepicker'
import CustomCheckbox from '../Input/checkbox'
import CategoriesPicker from '../Input/categories-picker'
import FetchStates from '../../stores/requestState'
import DashboardExcelDownload from './excelExport'
import GraphXScale from '../../models/GraphXScale'
import { getCompanyId } from '../../services/authService'
import CustomInput from '../Input/custom-input'
import rootStore from '../../stores/RootStore'
import CustomSelect from '../Input/custom-select'
import IOptionsValue from '../../models/OptionsValue'

const DashboardFilter = observer(() => {
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

  useEffect(() => {
    fetchDashboardDate(
      startdate,
      enddate,
      tags.filter(t => t).map(t => t.value),
      searchWord,
      ownData
    )
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
    fetchDashboardDate(
      startdate,
      enddate,
      tags.length > 0 ? tags?.map(t => t.value) : [],
      searchWord,
      ownData
    )
  }

  const xAxisScaleOptions = [
    { label: 'Uger', value: String(GraphXScale.weeks) },
    { label: 'Måneder', value: String(GraphXScale.mounths) }
  ] as IOptionsValue[]

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
        <CustomSelect
          fill
          defaultValue={Number(xAxisScale)}
          values={xAxisScaleOptions}
          onChange={e => setXAxisScale(Number(e))}
        />
      </li>
      <li className='tagdiv'>
        <CategoriesPicker
          fill
          values={tags}
          loading={categoriesStore.state === FetchStates.LOADING}
          categories={categoriesStore?.categories}
          setTags={selectedTags => setTags(selectedTags)}
        />
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
          z-index: 9999;
          right: 15px;
          position: absolute;
          background-color: var(--base);
          border-radius: var(--border-radius);
          padding: 7px 7px 5px 2px;
        }

        .btn-group > span {
          margin-left: 10px;
          padding: 5px;
        }
      `}</style>
    </ul>
  )
})

export default DashboardFilter

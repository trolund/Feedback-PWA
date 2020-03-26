import { useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { Filter } from 'react-feather'
import Page from '../components/page'
import Section from '../components/section'
import DashboardFilter from '../components/dashboard-filter'
import dashboardStore from '../stores/dashboard-store'
import DashboardOverview from '../components/dashboard-overview'
import img from '../../public/images/nofilter.svg'
import CalculationService from '../services/calculationService'

export default observer(() => {
  const { data, state } = useContext(dashboardStore)
  const [showFilter, setShowFilter] = useState(true)
  const calculationService = new CalculationService()

  const graphdata = useCallback(() => calculationService.calGraphData(data), [
    calculationService,
    data
  ])

  const ShowAndHideFilterBtn = () => {
    return (
      <a
        role='button'
        tabIndex={0}
        className='float-right'
        onClick={() => setShowFilter(!showFilter)}
        onKeyDown={() => setShowFilter(!showFilter)}
      >
        {showFilter ? (
          // eslint-disable-next-line global-require
          <img
            alt='nofilter'
            className='nofilter'
            style={{ height: '25px', width: '25px' }}
            src={img}
          />
        ) : (
          <Filter />
        )}
      </a>
    )
  }

  return (
    <Page
      showBackButton={false}
      component={<ShowAndHideFilterBtn />}
      title='Home'
    >
      <Section>
        <section className='grid-container'>
          {showFilter && (
            <div className='item-a filter'>
              <DashboardFilter />
            </div>
          )}
          <div className='item-b'>
            <DashboardOverview graphData={graphdata()} fetchState={state} />
          </div>
        </section>
      </Section>
      <style jsx>{`
        @media only screen and (max-width: 800px) {
          .grid-container {
            display: block !important;
          }
          .filter {
            padding-top: 100px !important;
            background-color: var(--surface);
            border-radius: 0;
            width: 100%;
            top: 0;
            left: 0;
            right: 0;
            position: absolute;
            border-radius: 0 !important;
            border: none !important;
          }
        }
        .filter {
          border: solid 1px var(--text);
          border-radius: var(--border-radius);
          padding: 15px;
          z-index: 9;
        }
        .grid-container {
          display: grid;
          grid-template-columns: calc(50% - 0.51em) calc(50% - 0.51em);
          grid-gap: 1rem;
        }

        .item-a {
          grid-column: 1;
          grid-row: 1 / 3;
        }
        .item-b {
          grid-column: 2;
          grid-row: 1 / 3;
        }
      `}</style>
    </Page>
  )
})

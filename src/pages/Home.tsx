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
  const { data, state, ownData } = useContext(dashboardStore)
  const [showFilter, setShowFilter] = useState(true)
  const calculationService = new CalculationService()

  const graphdata = useCallback(
    () => calculationService.calGraphData(data, ownData),
    [calculationService, data, ownData]
  )

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
        <section className='flex-container'>
          {showFilter && (
            <div className='filter'>
              <DashboardFilter />
            </div>
          )}
          <div className='charts'>
            <DashboardOverview graphData={graphdata()} fetchState={state} />
          </div>
        </section>
      </Section>
      <style jsx>{`
        @media only screen and (max-width: 900px) {
          .filter {
            padding-top: 100px !important;
            background-color: var(--divider);
            border-radius: 0;
            width: 100%;
            top: 0;
            left: 0;
            right: 0;
            position: absolute;
            border-radius: 0 !important;
            border: none !important;
          }

          .charts {
            margin: 5px;
            width: 100%;
          }
        }
        .filter {
          border: solid 1px var(--divider);
          border-radius: var(--border-radius);
          padding: 15px;
          z-index: 9;
          padding: 10px;
          max-height: 650px;
          flex: 1;
        }

        .charts {
          padding: 20px;
          flex: 1;
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

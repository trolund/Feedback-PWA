import { useContext, useCallback } from 'react'
import { observer } from 'mobx-react'
import { Filter } from 'react-feather'
import Page from '../components/essentials/page'
import Section from '../components/essentials/section'
import DashboardFilter from '../components/dashboard/dashboard-filter'
import DashboardOverview from '../components/dashboard/dashboard-overview'
import img from '../../public/images/nofilter.svg'
import CalculationService from '../services/calculationService'
import withAuth from '../components/hoc/withAuth'
import BottomModal from '../components/essentials/bottom-modal'
import rootStore from '../stores/RootStore'
import TheNextWeek from '../components/dashboard/theNextWeek'
import QuestionAnalyser from '../components/dashboard/questionAnalyser'
import MiddelLoader from '../components/essentials/middelLoading'
import FetchStates from '../stores/requestState'
import Rating from '../components/dashboard/Rating'

export default withAuth(
  observer(() => {
    const {
      dashboardStore: {
        data,
        fetchState: state,
        cutoff,
        useFixedYAxis,
        useSkipZero,
        xAxisScale,
        showFilter,
        setShowFilter
      }
    } = useContext(rootStore)

    const calculationService = new CalculationService()

    const graphdata = useCallback(
      () =>
        calculationService.calGraphData(data, cutoff, xAxisScale, useSkipZero),
      [calculationService, cutoff, data, useSkipZero, xAxisScale]
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
        title='Oversigt'
      >
        <BottomModal
          show={showFilter}
          setShow={setShowFilter}
          content={<DashboardFilter />}
        />
        <MiddelLoader loading={state === FetchStates.LOADING} />
        <Section>
          <Rating />
          <DashboardOverview
            graphData={graphdata()}
            fetchState={state}
            useFixedXAxis={useFixedYAxis}
          />
          <TheNextWeek />
          <QuestionAnalyser data={data} />
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

          @media only screen and (max-width: 600px) {
            .charts {
              padding: 10px;
              padding-top: 0px;
            }
          }

          .filter {
            border: solid 1px var(--divider);
            border-radius: var(--border-radius);
            padding: 15px;
            z-index: 9;
            padding: 10px;
            max-height: 650px;
          }

          .charts {
            padding: 20px;
            max-height: 300px !important;
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
)

import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Filter } from 'react-feather'
import Page from '../components/page'
import Section from '../components/section'
import DashboardFilter from '../components/dashboard-filter'
import LineGraph from '../components/line-graph'
import dashboardStore from '../stores/dashboard-store'
import DashboardOverview from '../components/dashboard-overview'
import img from '../../public/images/nofilter.svg'

export default observer(() => {
  const { data, state } = useContext(dashboardStore)
  const [showFilter, setShowFilter] = useState(false)

  // const myData = {
  //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  //   datasets: [
  //     {
  //       label: 'Progress',
  //       backgroundColor: [
  //         '#FF6384',
  //         '#36A2EB',
  //         '#FFCE56',
  //         'rgb(23, 161, 129)',
  //         'rgb(163, 161, 129)',
  //         'rgb(263, 61, 129)',
  //         'rgb(163, 261, 129)'
  //       ],
  //       hoverBackgroundColor: [
  //         '#FF6384',
  //         '#36A2EB',
  //         '#FFCE56',
  //         'rgb(23, 161, 129)',
  //         'rgb(163, 161, 129)',
  //         'rgb(263, 61, 129)',
  //         'rgb(163, 261, 129)'
  //       ],
  //       borderColor: 'rgba(255,99,132,1)',
  //       borderWidth: 1,
  //       hoverBorderColor: 'rgba(255,99,132,1)',
  //       data: [65, 59, 80, 81, 56, 55, 40]
  //     }
  //   ]
  // }

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
            <LineGraph data={data} fetchState={state} showAllOfY={false} />
          </div>
          <div>
            <DashboardOverview />
          </div>
        </section>
      </Section>
      <style jsx>{`
        @media only screen and (max-width: 800px) {
          .grid-container {
            display: block !important;
          }
          .filter {
            padding-top: 50px !important;
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

import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import Page from '../components/page'
import Section from '../components/section'
import DashboardFilter from '../components/dashboard-filter'
import LineGraph from '../components/line-graph'
import dashboardStore from '../stores/dashboard-store'
import DashboardOverview from '../components/dashboard-overview'

export default observer(() => {
  const { data, state } = useContext(dashboardStore)

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

  return (
    <Page showBackButton={false}>
      <Section>
        <h2>Home</h2>
      </Section>
      <section className='grid-container'>
        <div className='item-a show'>
          <DashboardFilter />
        </div>
        <div className='item-b'>
          <LineGraph data={data} fetchState={state} showAllOfY={false} />
        </div>
        <div>
          <DashboardOverview />
        </div>
      </section>

      <style jsx>{`
        @media only screen and (max-width: 800px) {
          .grid-container {
            display: block !important;
          }
        }
        .show {
          border: solid 1px var(--text);
          border-radius: 15px;
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

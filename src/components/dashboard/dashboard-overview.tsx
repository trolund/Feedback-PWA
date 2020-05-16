import { useState } from 'react'
import { PieChart, BarChart2 } from 'react-feather'
import LineGraph from './charts/line-graph'
import GraphData from '../../models/GraphData'
import FetchStates from '../../stores/requestState'
import BarGraph from './charts/bar-chart'

type overviewprops = {
  graphData: GraphData
  fetchState: FetchStates
  useFixedXAxis: boolean
}

const DashboardOverview = (props: overviewprops) => {
  const [showBarChart, setShowBarChart] = useState(false)
  const { graphData, fetchState, useFixedXAxis } = props

  return (
    <div className='card'>
      <h5>
        Udvikling
        <div
          role='button'
          tabIndex={0}
          className='float-right'
          onClick={() => setShowBarChart(!showBarChart)}
          onKeyDown={() => setShowBarChart(!showBarChart)}
        >
          {showBarChart ? <PieChart /> : <BarChart2 />}
        </div>
      </h5>

      {!showBarChart ? (
        <LineGraph
          data={graphData}
          fetchState={fetchState}
          useFixedXAxis={useFixedXAxis}
        />
      ) : (
        <BarGraph
          data={graphData}
          fetchState={fetchState}
          useFixedXAxis={useFixedXAxis}
        />
      )}
      <p className='card-footer text-muted'>
        Bygger på <b>{graphData.numberOfBatches ?? 0}</b> tilbagemeldinger
      </p>
      <style jsx>{`
        header {
          padding: 0 var(--gap);
          padding-top: env(safe-area-inset-top);
          width: 100%;
          height: calc(env(safe-area-inset-top) + 72px);
          background: var(--base);
          border-bottom: 1px solid var(--divider);
          display: flex;
          align-items: center;
          z-index: 10;
          position: fixed;
          top: 0;
          left: 0;
          transition: var(--transition-colors);
        }

        nav {
          display: flex;
          align-items: center;
          z-index: 4;
        }

        h5 {
          margin-top: 0px;
        }

        .divider {
          margin: 0 var(--gap);
          width: 1px;
          height: 28px;
          background: var(--divider);
          display: flex;
          transition: var(--transition-colors);
        }
      `}</style>
    </div>
  )
}

export default DashboardOverview

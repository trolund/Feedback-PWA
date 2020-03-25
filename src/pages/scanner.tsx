import dynamic from 'next/dynamic'
import { observer } from 'mobx-react-lite'
import Router from 'next/router'
import Page from '../components/page'

const QrReader = dynamic(() => import('react-qr-reader'), {
  ssr: false
})

const Scanner = observer(() => {
  const handleScan = data => {
    if (data) {
      console.log('====================================')
      console.log(data)
      console.log('====================================')
      Router.push(data)
    }
  }
  const handleError = err => {
    console.error(err)
  }
  return (
    <Page title='' showBottomNav={false} fullscreen showBackButton>
      <QrReader
        className='container'
        delay={300}
        onError={handleError}
        onScan={handleScan}
      />
      <style jsx>{`
        .container {
          position: absolute;
          min-width: 100%;
          min-height: 100%;
        }
        .container > section {
          position: absolute !important;
          min-width: 100%;
          min-height: 100%;
        }
      `}</style>
    </Page>
  )
})

export default Scanner

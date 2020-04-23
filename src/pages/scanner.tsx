import dynamic from 'next/dynamic'
import { observer } from 'mobx-react-lite'
import Router from 'next/router'
import Page from '../components/page'
import Section from '../components/section'

const QrReader = dynamic(() => import('react-qr-reader'), {
  ssr: false
})

const Scanner = observer(() => {
  const handleScan = (data: string) => {
    if (data) {
      const parts = data.split(',')
      console.log('====================================')
      console.log(parts[-1])
      console.log('====================================')
      Router.push(data)
    }
  }
  const handleError = err => {
    console.error(err)
  }
  return (
    <Page
      title='QR kode scanner'
      showBottomNav={false}
      fullscreen
      showBackButton
    >
      <Section>
        <div className='container'>
          <QrReader
            className='cam-view'
            delay={300}
            onError={handleError}
            onScan={handleScan}
          />
          <hr />
          <p style={{ textAlign: 'center', width: '100%' }}>
            Scan QR kode for et møde for at give feedback
          </p>
        </div>
      </Section>

      <style jsx>{`
        .container {
          position: absolute;
          left: 0;
          right: 0;
          padding-top: 50px;
          position: absolute;
          min-width: 100%;
          min-height: 100%;
        }

        .cam-view section div {
          box-shadow: rgba(0, 255, 0, 0.5) 0px 0px 0px 5px inset !important;
        }
      `}</style>
    </Page>
  )
})

export default Scanner

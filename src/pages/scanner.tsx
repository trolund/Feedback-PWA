import { useState } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import { observer } from 'mobx-react'
import Router from 'next/router'
import Page from '../components/essentials/page'
import Section from '../components/essentials/section'
import MiddelLoader from '../components/essentials/middelLoading'
import { logEvent } from '../utils/analytics'

const QrReader = dynamic(() => import('react-qr-reader'), {
  ssr: false
})

const Scanner = observer(() => {
  const [error, setError] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [loadingmsg, setLoadingmsg] = useState('Åbner Kamera')

  const handleScan = (data: string) => {
    if (data) {
      setLoadingmsg('Forbereder spørgsmål')
      setLoading(true)
      const parts = data.split('/')
      logEvent('scanner-event', 'Scanner sucesss', 0, parts[parts.length - 1])
      Router.push(`/feedback/${parts[parts.length - 1]}`)
    }
  }

  const handleError = err => {
    console.error(err)
    logEvent('scanner-event', 'Scanner error', 0, JSON.stringify(err))
    setError('Fejl ved læsning.')
    toast(
      'Fejl ved læsning, din endhed understøtter muligvis ikke at bruge kameraet.'
    )
  }

  return (
    <Page
      title='QR kode scanner'
      showBottomNav={false}
      fullscreen
      showBackButton
    >
      <MiddelLoader loading={loading} text={loadingmsg} />
      <Section>
        <div className='container'>
          <QrReader
            className='cam-view'
            delay={300}
            onError={handleError}
            onScan={handleScan}
            onLoad={() => setLoading(false)}
          />
          <hr />
          <p style={{ textAlign: 'center', width: '100%' }}>
            Scan QR kode for et møde for at give feedback
          </p>
          {error !== undefined && <p>{error}</p>}
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

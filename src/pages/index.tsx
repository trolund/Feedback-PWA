import Link from 'next/link'
import Page from '../components/page'
import Section from '../components/section'
import { getPlaceholderName } from '../helpers'

export default () => {
  const data = []

  for (let i = 0; i < 10; i++) {
    data.push(getPlaceholderName())
  }

  return (
    <Page showBottomNav={false} showHead={false}>
      <Section>
        <div className='logo' />
        <input type='text' placeholder='møde id' />
        <Link href='/login' key='login'>
          <a title='login' aria-label='login'>
            login
          </a>
        </Link>
      </Section>

      <style jsx>{`
        .logo {
          background-image: url('/images/logo.png');
          background-size: contain;
          background-repeat: no-repeat;
          height: 100px;
          width: 230px;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 20px;
        }
      `}</style>
    </Page>
  )
}

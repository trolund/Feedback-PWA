import Link from 'next/link'
import Page from '../components/page'
import Section from '../components/section'
import { getPlaceholderName } from '../helpers'

export default () => {
  const data = []

  for (let i = 0; i < 10; i++) {
    data.push(getPlaceholderName())
  }

  const loginHandler = () => {
    console.log('hej')
  }

  return (
    <Page showHead={false} showBottomNav={false}>
      <Section>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <input type='text' placeholder='Email' />
        <input type='password' placeholder='Kodeord' />
        <Link href='#'>
          <a
            tabIndex={0}
            role='button'
            title='login'
            aria-label='login'
            onKeyDown={loginHandler}
            onClick={loginHandler}
          >
            login
          </a>
        </Link>
      </Section>

      <style jsx>{`
        input {
          margin-top: 20px;
        }

        a {
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </Page>
  )
}

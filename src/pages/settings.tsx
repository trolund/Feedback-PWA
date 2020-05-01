import { observer } from 'mobx-react-lite'
import Page from '../components/page'
import Section from '../components/section'
import ThemeButton from '../components/theme-button'

const Settings = observer(() => {
  return (
    <Page title='Indstillinger'>
      <Section>
        <ul>
          <li>
            <h4 className='float-left'>Dark theme</h4>
            <div className='float-right'>
              <ThemeButton />
            </div>
          </li>
          <li>
            <h4 className='float-left'>Sprog</h4>
            <div className='float-right'>
              <ThemeButton />
            </div>
          </li>
          <li>
            <h4 className='float-left'>Sprog</h4>
            <div className='float-right'>
              <ThemeButton />
            </div>
          </li>
        </ul>
      </Section>
      <style jsx>{`
        li {
          color: var(--fg);
          padding: var(--gap-small);
          background: var(--base);
          display: flex;
          align-items: center;
          transition: var(--transition-colors);
        }

        li:not(:last-child) {
          border-bottom: 1px solid var(--divider);
        }

        h4 {
          color: var(--fg);
          margin-left: var(--gap-small);
          font-weight: 500;
          letter-spacing: 0.0035em;
        }
      `}</style>
    </Page>
  )
})

export default Settings

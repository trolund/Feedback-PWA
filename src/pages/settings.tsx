import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import Page from '../components/essentials/page'
import Section from '../components/essentials/section'
import ThemeButton from '../components/theme-button'
import Switch from '../components/essentials/switch'

import rootStore from '../stores/RootStore'

const Settings = observer(() => {
  const {
    settingStore: {
      showTitleInBottomNav,
      setShowTitleInBottomNav,
      setRealtimeFeedbackDefault,
      realtimeFeedbackDefault,
      setHideTempQuestionSets,
      hideTempQuestionSets,
      animation,
      setAnimation
    }
  } = useContext(rootStore)

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
            <h4 className='float-left'>Realtids tilbagemeldinger</h4>
            <div className='float-right'>
              <Switch
                setValue={setRealtimeFeedbackDefault}
                value={realtimeFeedbackDefault}
              />
            </div>
          </li>
          <li>
            <h4 className='float-left'>Hvis ikke templete spørgsmåls sæt</h4>
            <div className='float-right'>
              <Switch
                setValue={setHideTempQuestionSets}
                value={hideTempQuestionSets}
              />
            </div>
          </li>
          <li>
            <h4 className='float-left'>Slå animationer</h4>
            <div className='float-right'>
              <Switch setValue={setAnimation} value={animation} />
            </div>
          </li>
          {/* <li>
            <h4 className='float-left'>Sprog</h4>
            <div className='float-right'>Kommer snart.</div>
          </li> */}
          <li>
            <h4 className='float-left'>Hvis title i bund baren</h4>
            <div className='float-right'>
              <Switch
                setValue={setShowTitleInBottomNav}
                value={showTitleInBottomNav}
              />
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

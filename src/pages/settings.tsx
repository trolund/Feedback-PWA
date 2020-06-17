import { observer } from 'mobx-react'
import { useContext } from 'react'
import { X, Check } from 'react-feather'
import Switch from 'react-switch'
import Page from '../components/essentials/page'
import Section from '../components/essentials/section'
import ThemeButton from '../components/theme-button'

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
            <h4 className='float-left'>Mørkt tema</h4>
            <div className='float-right'>
              <ThemeButton />
            </div>
          </li>
          <li>
            <h4 className='float-left'>Live tilbagemeldinger</h4>
            <span className='float-right'>
              <Switch
                onChange={setRealtimeFeedbackDefault}
                checked={realtimeFeedbackDefault}
                onColor='#19896f'
                offColor='#6a6b6e'
                uncheckedIcon={
                  <X
                    style={{
                      width: '27px',
                      height: '27px',
                      padding: '5px',
                      color: 'white'
                    }}
                  />
                }
                checkedIcon={
                  <Check
                    style={{
                      width: '27px',
                      height: '27px',
                      padding: '5px',
                      color: 'white'
                    }}
                  />
                }
              />
            </span>
          </li>
          <li>
            <h4 className='float-left'>Vis ikke template spørgsmålssæt</h4>
            <div className='float-right'>
              <Switch
                key='hej'
                onChange={setHideTempQuestionSets}
                checked={hideTempQuestionSets}
                onColor='#19896f'
                offColor='#6a6b6e'
                uncheckedIcon={
                  <X
                    style={{
                      width: '27px',
                      height: '27px',
                      padding: '5px',
                      color: 'white'
                    }}
                  />
                }
                checkedIcon={
                  <Check
                    style={{
                      width: '27px',
                      height: '27px',
                      padding: '5px',
                      color: 'white'
                    }}
                  />
                }
              />
            </div>
          </li>
          <li>
            <h4 className='float-left'>Brug animationer</h4>
            <div className='float-right'>
              <Switch
                onChange={setAnimation}
                checked={animation}
                onColor='#19896f'
                offColor='#6a6b6e'
                uncheckedIcon={
                  <X
                    style={{
                      width: '27px',
                      height: '27px',
                      padding: '5px',
                      color: 'white'
                    }}
                  />
                }
                checkedIcon={
                  <Check
                    style={{
                      width: '27px',
                      height: '27px',
                      padding: '5px',
                      color: 'white'
                    }}
                  />
                }
              />
            </div>
          </li>
          {/* <li>
            <h4 className='float-left'>Sprog</h4>
            <div className='float-right'>Kommer snart.</div>
          </li> */}
          <li>
            <h4 className='float-left'>Vis titler i menuen</h4>
            <div className='float-right'>
              <Switch
                onChange={setShowTitleInBottomNav}
                checked={showTitleInBottomNav}
                onColor='#19896f'
                offColor='#6a6b6e'
                uncheckedIcon={
                  <X
                    style={{
                      width: '27px',
                      height: '27px',
                      padding: '5px',
                      color: 'white'
                    }}
                  />
                }
                checkedIcon={
                  <Check
                    style={{
                      width: '27px',
                      height: '27px',
                      padding: '5px',
                      color: 'white'
                    }}
                  />
                }
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
          width: inherit;
          width: -webkit-fill-available;
        }
      `}</style>
    </Page>
  )
})

export default Settings

import { observer } from 'mobx-react-lite'
import Page from '../components/page'
import Section from '../components/section'
import ThemeButton from '../components/theme-button'

const Settings = observer(() => {
  return (
    <Page title='Settings'>
      <Section>
        <p>Dark theme</p>
        <ThemeButton />
      </Section>
    </Page>
  )
})

export default Settings

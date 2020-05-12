import ReactGA from 'react-ga'
import isServer from './helper'

export const initGA = () => {
  console.log('GA init')
  ReactGA.initialize('UA-166139475-1')
  // if (process.env.ENV === 'production') {
  //   console.log('GA init')
  //   ReactGA.initialize('UA-166139475-1')
  // } else {
  //   console.log('GA not init because in dev')
  // }
}
export const logPageView = () => {
  console.log(`Logging pageview for ${window.location.pathname}`)
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}
export const logEvent = (
  category: string = '',
  action: string = '',
  value?: number,
  label?: string
) => {
  if (category && action) {
    ReactGA.event({ category, action, label, value })
  }
}
export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal })
  }
}

/* eslint-disable import/prefer-default-export */
import { logEvent } from './analytics'

export const logLaunched = () => {
  if ((navigator as any).standalone) {
    logEvent('Launched', 'Launched: Installed (iOS)')
  } else if (matchMedia('(display-mode: standalone)').matches) {
    logEvent('Launched', 'Launched: Installed')
  } else {
    logEvent('Launched', 'Launched: Browser Tab')
  }
}

export const logIndstall = () =>
  logEvent('appinstalled', 'appinstalled-success')

export const logIndstallServiceWorker = () =>
  logEvent('appinstalled', 'appinstalled-Service-worker-success')

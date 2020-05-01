declare global {
  interface Window {
    isLight: boolean
  }
}

const isServer = typeof window === 'undefined'

export function getLightMode() {
  if (!isServer) {
    return window.isLight
  }
  return false
}

export default function toggleLightMode(isLight: boolean) {
  if (!isLight) {
    try {
      document.querySelector('html').classList.add('light')
      window.isLight = isLight
    } catch (err) {
      // todo
    }
  } else {
    try {
      document.querySelector('html').classList.remove('light')
      window.isLight = isLight
    } catch (err) {
      // todo
    }
  }
}

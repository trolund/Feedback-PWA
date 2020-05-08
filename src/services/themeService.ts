declare global {
  interface Window {
    isDark: boolean
  }
}

const isServer = typeof window === 'undefined'

export function getLightMode() {
  if (!isServer) {
    return window.isDark
  }
  return true
}

export default function toggleLightMode(isLight: boolean) {
  if (!isLight) {
    try {
      document.querySelector('html').classList.add('light')
      window.isDark = isLight
    } catch (err) {
      // todo
    }
  } else {
    try {
      document.querySelector('html').classList.remove('light')
      window.isDark = isLight
    } catch (err) {
      // todo
    }
  }
}

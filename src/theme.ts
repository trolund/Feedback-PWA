const isServer = typeof window === 'undefined'

export function getLightMode() {
  if (!isServer) {
    return window.isDark
  }
  return true
}

export function toggleLightMode() {
  const isDark = getLightMode()
  if (!isDark) {
    try {
      window.localStorage.setItem('light-mode', '0')
      document.querySelector('html').classList.add('dark')
      window.isDark = true
    } catch (err) {
      // todo
    }
  } else {
    try {
      window.localStorage.removeItem('light-mode')
      document.querySelector('html').classList.remove('dark')
      window.isDark = false
    } catch (err) {
      // todo
    }
  }
}

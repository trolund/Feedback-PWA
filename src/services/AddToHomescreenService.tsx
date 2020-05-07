import * as React from 'react'

interface IBeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function useAddToHomescreenPrompt(): [
  IBeforeInstallPromptEvent | null,
  () => void
] {
  const [prompt, setState] = React.useState<IBeforeInstallPromptEvent | null>(
    null
  )

  // const isIos = () => {
  //   const userAgent = window.navigator.userAgent.toLowerCase()
  //   return /iphone|ipad|ipod/.test(userAgent)
  // }

  // const isInStandaloneMode = () =>
  //   'standalone' in window.navigator && (window.navigator as any).standalone

  // Checks if should display install popup notification:

  const promptToInstall = () => {
    if (prompt) {
      return prompt.prompt()
    }
    return Promise.reject(
      new Error(
        'Tried installing before browser sent "beforeinstallprompt" event'
      )
    )
  }

  React.useEffect(() => {
    const ready = (e: IBeforeInstallPromptEvent) => {
      e.preventDefault()
      setState(e)
    }

    window.addEventListener('beforeinstallprompt', ready as any)

    return () => {
      window.removeEventListener('beforeinstallprompt', ready as any)
    }
  }, [])

  return [prompt, promptToInstall]
}

/* eslint-disable import/prefer-default-export */
/* eslint-disable one-var */
/* eslint-disable no-var */

import isServer from '../utils/helper'

// inspired by https://gist.github.com/ngoclt/2857281
export const getIOSVersion = (): number => {
  if (!isServer) {
    const agent = window.navigator.userAgent
    const start = agent.indexOf('OS ')
    if (
      (agent.indexOf('iPhone') > -1 || agent.indexOf('iPad') > -1) &&
      start > -1
    ) {
      const res = window.Number(agent.substr(start + 3, 3).replace('_', '.'))
      console.log(res)

      return res
    }
  }
  return undefined
}

export const getAndroidVersion = (): number => {
  if (!isServer) {
    const agent = window.navigator.userAgent
    const match = agent.match(/android\s([0-9.]*)/i)
    return parseInt(match ? match[1] : undefined, 10)
  }
  return undefined
}

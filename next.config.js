/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
require('dotenv').config()
const withPWA = require('next-pwa')
// const withOffline = require('next-offline')
// const withSass = require('@zeit/next-sass')
const withImages = require('next-images')

console.debug('Api_url ', process.env.API_URL)

module.exports = withImages(
  withPWA({
    pwa: {
      dest: 'public'
    },
    env: {
      ENV: process.env.NODE_ENV,
      apiUrl: process.env.API_URL,
      spinOffCompenyId: 1
    },
    webpack: (config, { isServer }) => {
      let newConfig
      if (!isServer) {
        newConfig = {
          ...config,
          node: {
            fs: 'empty'
          }
        }
      }

      return newConfig || config
    }
  })
)

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
      dest: 'public',
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: {
              maxEntries: 4,
              maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
            }
          }
        },
        {
          urlPattern: /^https:\/\/use\.fontawesome\.com\/releases\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'font-awesome',
            expiration: {
              maxEntries: 1,
              maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
            }
          }
        },
        {
          urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-font-assets',
            expiration: {
              maxEntries: 4,
              maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
            }
          }
        },
        {
          urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-image-assets',
            expiration: {
              maxEntries: 64,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
          }
        },
        {
          urlPattern: /\.(?:js)$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-js-assets',
            expiration: {
              maxEntries: 16,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
          }
        },
        {
          urlPattern: /\.(?:css|less)$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-style-assets',
            expiration: {
              maxEntries: 16,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
          }
        },
        {
          urlPattern: /\.(?:json|xml|csv)$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-data-assets',
            expiration: {
              maxEntries: 16,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
          }
        },
        {
          urlPattern: /.*\/Api\/.*$/i,
          handler: 'NetworkOnly',
          method: 'GET',
          options: {
            cacheName: 'apis',
            expiration: {
              maxEntries: 16,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
          }
        },
        {
          urlPattern: /.*\/Api\/.*$/i,
          handler: 'NetworkOnly',
          method: 'POST',
          options: {
            cacheName: 'apis',
            expiration: {
              maxEntries: 16,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
          }
        },
        {
          urlPattern: /.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'others',
            expiration: {
              maxEntries: 16,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
          }
        }
      ]
    },
    env: {
      ENV: 'production',
      apiUrl: 'https://feedbackbackend.azurewebsites.net',
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

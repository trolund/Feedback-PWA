const withPWA = require('next-pwa')
// const withSass = require('@zeit/next-sass')
const withImages = require('next-images')

module.exports = withImages(
  withPWA({
    pwa: {
      dest: 'public'
    },
    env: {
      apiUrl: 'http://localhost:4000'
    }
  })
)

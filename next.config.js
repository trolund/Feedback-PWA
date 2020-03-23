const withPWA = require('next-pwa')
const withSass = require('@zeit/next-sass')

module.exports = withSass()

module.exports = withPWA({
  pwa: {
    dest: 'public'
  },
  env: {
    apiUrl: 'http://localhost:4000'
  }
})

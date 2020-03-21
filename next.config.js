const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
    dest: 'public'
  },
  env: {
    apiUrl: 'http://localhost:4000'
  }
})

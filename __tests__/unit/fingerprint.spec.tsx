/// <reference types="jest" />

import Fingerprint2 from 'fingerprintjs2'

describe('validate date manipulation', () => {
  describe('test password validation', () => {
    it('should create', function() {
      if (window != null) {
        //   requestIdleCallback(function() {
        //     Fingerprint2.get(function(components) {
        //       console.log(components) // an array of components: {key: ..., value: ...}
        //     })
        //   })
      } else {
        setTimeout(function() {
          Fingerprint2.get(function(components) {
            console.log(components) // an array of components: {key: ..., value: ...}
          })
        }, 500)
      }
    })
  })
})

import { persist } from 'mobx-persist'

class Fingerprint {
  constructor(fingerprint: string) {
    const expDate = new Date()
    this.exp = expDate.setDate(expDate.getDate() + 30)
    this.fingerprint = fingerprint
  }

  @persist exp: number

  @persist fingerprint: string
}

export default Fingerprint

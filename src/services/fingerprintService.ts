/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
/* eslint-disable no-undef */
import Fingerprint2 from 'fingerprintjs2'

export const hashComponents = (components: Fingerprint2.Component[]) => {
  const values = components.map(component => component.value)
  const murmur = Fingerprint2.x64hash128(values.join(''), 31)
  // console.log(`fingerprint: ${murmur}, com: ${components}`)
  return murmur
}

const createFingerprint = async (): Promise<string> => {
  const com = await Fingerprint2.getPromise()
  const fingerprint = hashComponents(com)
  return fingerprint
}

export default createFingerprint

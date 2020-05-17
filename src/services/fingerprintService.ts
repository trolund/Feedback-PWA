import Fingerprint2 from 'fingerprintjs2'
import { logEvent, logException } from '../utils/analytics'

export const hashComponents = (components: Fingerprint2.Component[]) => {
  const values = components.map(component => component.value)
  const murmur = Fingerprint2.x64hash128(values.join(''), 31)
  // console.log(`fingerprint: ${murmur}, com: ${components}`)
  return murmur
}

const createFingerprint = async (): Promise<string> => {
  let fingerprint = null
  try {
    const com = await Fingerprint2.getPromise()
    logEvent(
      'fingerprint',
      'fingerprint-creation-success',
      0,
      JSON.stringify(com)
    )
    fingerprint = hashComponents(com)
  } catch (e) {
    logEvent('fingerprint', 'fingerprint-creation-error', 0, JSON.stringify(e))
    logException(e, false)
  }
  return fingerprint
}

export default createFingerprint

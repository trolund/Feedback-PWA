/* eslint-disable import/prefer-default-export */

export const spliceDateAndTime = (datePart: Date, timePart: Date): Date => {
  datePart.setMinutes(timePart.getMinutes())
  datePart.setHours(timePart.getHours())
  datePart.setSeconds(0)
  datePart.setMilliseconds(0)
  return datePart
}

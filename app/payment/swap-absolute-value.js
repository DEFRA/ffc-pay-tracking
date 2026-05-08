const { FPTT } = require('../constants/source-systems')

const swapAbsoluteValue = (sourceSystem) => {
//  FPTT is the only scheme that has absolute value, so we return 1 for it and -1 for all others
  const absoluteValueSchemes = [FPTT].includes(sourceSystem)
  return absoluteValueSchemes ? -1 : 1
}

module.exports = {
  swapAbsoluteValue
}

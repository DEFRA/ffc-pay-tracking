const { FPTT } = require('../constants/schemes')

const swapAbsoluteValue = (schemeId) => {
//  FPTT is the only scheme that has absolute value, so we return 1 for it and -1 for all others
  const absoluteValueSchemes = [FPTT].includes(schemeId)
  return absoluteValueSchemes ? -1 : 1
}

module.exports = {
  swapAbsoluteValue
}

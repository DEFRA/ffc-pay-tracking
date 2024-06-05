const { BPS } = require('../constants/schemes')

const getCrossBorderFlag = (event) => {
  if (event.data.schemeId !== BPS) {
    return null
  }
  const RP00 = 'RP00'
  if (event.data.invoiceLines.some(line => line.deliveryBody !== RP00)) {
    return 'E2P'
  }
  return 'D2P'
}

module.exports = {
  getCrossBorderFlag
}

const { BPS } = require('../constants/schemes')

const checkCrossBorderType = (paymentRequest) => {
  if (paymentRequest.schemeId !== BPS) {
    return null
  }
  const RP00 = 'RP00'
  if (paymentRequest.invoiceLines.some(line => line.deliveryBody !== RP00)) {
    return 'D2P'
  }
  return 'E2P'
}

module.exports = {
  checkCrossBorderType
}

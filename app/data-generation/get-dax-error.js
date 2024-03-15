const { PAYMENT_DAX_REJECTED, PAYMENT_INVALID_BANK } = require('../constants/warnings')

const getDAXError = (event) => {
  if ([PAYMENT_DAX_REJECTED, PAYMENT_INVALID_BANK].includes(event.type)) {
    return event.data.message
  }
  return null
}

module.exports = {
  getDAXError
}

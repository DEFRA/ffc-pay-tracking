const { PAYMENT_DAX_REJECTED, PAYMENT_INVALID_BANK } = require('../constants/warnings')

const getPHError = (event) => {
  if (![PAYMENT_DAX_REJECTED, PAYMENT_INVALID_BANK].includes(event.type)) {
    return event.data.message ?? `An undetermined error occurred at ${event.source}`
  }
  return null
}

module.exports = {
  getPHError
}

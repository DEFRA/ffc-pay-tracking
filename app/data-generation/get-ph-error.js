const { WARNING_EVENT_PREFIX } = require('../constants/event-prefixes')
const { PAYMENT_DAX_REJECTED, PAYMENT_INVALID_BANK } = require('../constants/warnings')

const getPHError = (event) => {
  if (event.type.includes(WARNING_EVENT_PREFIX) && ![PAYMENT_DAX_REJECTED, PAYMENT_INVALID_BANK].includes(event.type)) {
    return event.data.message
  }
  return null
}

module.exports = {
  getPHError
}

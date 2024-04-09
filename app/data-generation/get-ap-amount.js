const { PAYMENT_PROCESSED } = require('../constants/events')
const { AR } = require('../constants/ledgers')

const getAPAmount = (event) => {
  if (event.type !== PAYMENT_PROCESSED || event.data.ledger === AR) {
    return null
  }
  return event.data.value
}

module.exports = {
  getAPAmount
}

const { PAYMENT_PROCESSED } = require('../constants/events')
const { AP } = require('../constants/ledgers')

const getARAmount = (event) => {
  if (event.type !== PAYMENT_PROCESSED || event.data.ledger === AP) {
    return null
  }
  return event.data.value
}

module.exports = {
  getARAmount
}

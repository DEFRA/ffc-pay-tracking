const { PAYMENT_SETTLED } = require('../constants/events')

const getSettledValue = (event) => {
  if (event.type === PAYMENT_SETTLED) {
    return event.data.settledValue
  }
  return null
}

module.exports = {
  getSettledValue
}

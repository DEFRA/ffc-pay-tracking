const { PAYMENT_EXTRACTED, PAYMENT_ENRICHED } = require('../constants/events')
const { convertToPence } = require('../currency-convert')

const getValue = (event) => {
  if (event.type === PAYMENT_EXTRACTED) {
    return convertToPence(event.data.value)
  }
  if (event.type === PAYMENT_ENRICHED) {
    return event.data.value
  }
  return null
}

module.exports = {
  getValue
}

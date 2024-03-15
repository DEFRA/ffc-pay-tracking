const { PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../constants/events')

const isImported = (event) => {
  if ([PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED].includes(event.type)) {
    return 'Y'
  }
  return null
}

module.exports = {
  isImported
}

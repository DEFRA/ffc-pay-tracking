const { PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../constants/events')

const getBatch = (event) => {
  if (![PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED].includes(event.type)) {
    return event.data.batch
  }
  return null
}

module.exports = {
  getBatch
}

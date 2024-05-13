const { PAYMENT_PAUSED_DEBT, PAYMENT_DEBT_ATTACHED } = require('../constants/events')

const isEnriched = (event) => {
  if (event.type === PAYMENT_PAUSED_DEBT) {
    return 'N'
  }
  if (event.type === PAYMENT_DEBT_ATTACHED) {
    return 'Y'
  }
  return null
}

module.exports = {
  isEnriched
}

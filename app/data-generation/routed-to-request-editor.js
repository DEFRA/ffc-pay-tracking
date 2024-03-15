const { PAYMENT_PAUSED_DEBT, PAYMENT_PAUSED_LEDGER, PAYMENT_PAUSED_QUALITY_CHECK } = require('../constants/events')

const routedToRequestEditor = (event) => {
  if ([PAYMENT_PAUSED_DEBT, PAYMENT_PAUSED_LEDGER, PAYMENT_PAUSED_QUALITY_CHECK].includes(event.type)) {
    return 'Y'
  }
  return null
}

module.exports = {
  routedToRequestEditor
}

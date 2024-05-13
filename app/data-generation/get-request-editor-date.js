const moment = require('moment')
const { PAYMENT_PAUSED_DEBT, PAYMENT_PAUSED_LEDGER } = require('../constants/events')

const getRequestEditorDate = (event) => {
  if ([PAYMENT_PAUSED_DEBT, PAYMENT_PAUSED_LEDGER].includes(event.type)) {
    return moment(event.time).format()
  }
  return null
}

module.exports = {
  getRequestEditorDate
}

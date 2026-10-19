const { reportData } = require('../database')
const { PAYMENT_ACKNOWLEDGED_STATUS, PAYMENT_SETTLED_STATUS } = require('../constants/statuses')
const { getStatus } = require('./get-status')
const { getDataFilter } = require('../helpers/get-data-filter')

const checkDAXPRN = async (event, transaction) => {
  const status = getStatus(event)
  if ([PAYMENT_ACKNOWLEDGED_STATUS, PAYMENT_SETTLED_STATUS].includes(status)) {
    return event.data.paymentRequestNumber
  }

  const { paymentRequestNumber, ...where } = getDataFilter(event.data)

  const previousRequests = await reportData(transaction ?? undefined)
    .where(where)
    .where('paymentRequestNumber', '<=', paymentRequestNumber)
    .orderBy('paymentRequestNumber', 'desc')

  for (const previousRequest of previousRequests) {
    if ([PAYMENT_ACKNOWLEDGED_STATUS, PAYMENT_SETTLED_STATUS].includes(previousRequest.status)) {
      return previousRequest.paymentRequestNumber
    }
  }

  return 0
}

module.exports = {
  checkDAXPRN
}

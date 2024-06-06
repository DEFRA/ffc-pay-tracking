const db = require('../data')
const { PAYMENT_ACKNOWLEDGED_STATUS, PAYMENT_SETTLED_STATUS } = require('../constants/statuses')
const { getDataFilter } = require('../get-data-filter')
const { getStatus } = require('./get-status')

const checkDAXPRN = async (event, transaction) => {
  const status = getStatus(event)
  if ([PAYMENT_ACKNOWLEDGED_STATUS, PAYMENT_SETTLED_STATUS].includes(status)) {
    return event.data.paymentRequestNumber
  }
  for (let i = event.data.paymentRequestNumber; i > 0; i--) {
    const where = getDataFilter(event.data)
    where.paymentRequestNumber = i
    const previousRequest = await db.reportData.findOne({
      where,
      transaction
    })
    if ([PAYMENT_ACKNOWLEDGED_STATUS, PAYMENT_SETTLED_STATUS].includes(previousRequest?.status)) {
      return previousRequest.paymentRequestNumber
    }
  }
  return 0
}

module.exports = {
  checkDAXPRN
}

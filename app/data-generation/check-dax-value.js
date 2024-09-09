const db = require('../data')
const { PAYMENT_ACKNOWLEDGED_STATUS, PAYMENT_SETTLED_STATUS } = require('../constants/statuses')
const { getStatus } = require('./get-status')
const { getDeltaAmount } = require('./get-delta-amount')
const { getDataFilter } = require('../helpers/get-data-filter')

const checkDAXValue = async (event, transaction) => {
  let value = 0
  let currentPRAdded = false
  const where = getDataFilter(event.data)
  delete where.paymentRequestNumber
  const previousRequests = await db.reportData.findAll({
    where,
    transaction
  })
  for (const paymentRequest of previousRequests) {
    if ([PAYMENT_ACKNOWLEDGED_STATUS, PAYMENT_SETTLED_STATUS].includes(paymentRequest.status)) {
      if (paymentRequest.paymentRequestNumber === event.data.paymentRequestNumber) {
        currentPRAdded = true
      }
      value += paymentRequest.deltaAmount
    }
  }
  const status = getStatus(event)
  if ([PAYMENT_ACKNOWLEDGED_STATUS, PAYMENT_SETTLED_STATUS].includes(status) && !currentPRAdded) {
    value += await getDeltaAmount(event, transaction)
  }

  return value
}

module.exports = {
  checkDAXValue
}

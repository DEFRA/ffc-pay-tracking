const db = require('../data')
const { getValue } = require('./get-value')
const { getDataFilter } = require('../get-data-filter')
const { PAYMENT_PROCESSED, PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../constants/events')

const getDeltaAmount = async (event, transaction) => {
  if ([PAYMENT_PROCESSED, PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED].includes(event.type)) {
    return event.data.value
  }
  const requestNumber = event.data.paymentRequestNumber
  const value = await getValue(event)
  if (requestNumber === 1 || value === null) {
    return value
  }
  const where = getDataFilter(event.data, true)
  const previousRequest = await db.reportData.findOne({
    where,
    transaction
  })
  return value - previousRequest?.value
}

module.exports = {
  getDeltaAmount
}

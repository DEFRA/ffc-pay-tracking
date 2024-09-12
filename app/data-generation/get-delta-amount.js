const db = require('../data')
const { getValue } = require('./get-value')
const { PAYMENT_PROCESSED, PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../constants/events')
const { getDataFilter } = require('../helpers/get-data-filter')

const getDeltaAmount = async (event, transaction) => {
  if ([PAYMENT_PROCESSED, PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED].includes(event.type)) {
    return event.data.value
  }
  const requestNumber = event.data.paymentRequestNumber
  const value = await getValue(event)
  if (requestNumber === 0 || value === null) {
    return value
  }
  const where = getDataFilter(event.data, true)
  const previousRequest = await db.reportData.findOne({
    where,
    transaction
  })
  const previousValue = previousRequest?.value ?? 0
  return value - previousValue
}

module.exports = {
  getDeltaAmount
}

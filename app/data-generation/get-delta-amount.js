const db = require('../data')
const { getValue } = require('./get-value')
const { getDataFilter } = require('../get-data-filter')

const getDeltaAmount = async (event, transaction) => {
  const requestNumber = event.data.paymentRequestNumber
  const value = getValue(event)
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

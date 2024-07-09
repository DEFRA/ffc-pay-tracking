const db = require('../data')

const { PAYMENT_EXTRACTED, PAYMENT_ENRICHED } = require('../constants/events')
const { convertToPence } = require('../currency-convert')
const { getDataFilter } = require('../get-data-filter')

const getValue = async (event, transaction) => {
  if (event.type === PAYMENT_EXTRACTED) {
    return convertToPence(event.data.value)
  }
  if (event.type === PAYMENT_ENRICHED) {
    return event.data.value
  }
  const where = getDataFilter(event.data)
  const existingRequest = await db.reportData.findOne({
    where,
    transaction
  })
  return existingRequest.value
}

module.exports = {
  getValue
}

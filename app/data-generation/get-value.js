const { reportData } = require('../database')
const { PAYMENT_EXTRACTED, PAYMENT_ENRICHED } = require('../constants/events')
const { convertToPence } = require('../helpers/currency-convert')
const { getDataFilter } = require('../helpers/get-data-filter')

const getValue = async (event, transaction) => {
  if (event.type === PAYMENT_EXTRACTED) {
    return convertToPence(event.data.value)
  }
  if (event.type === PAYMENT_ENRICHED) {
    return event.data.value
  }
  const where = getDataFilter(event.data)
  const existingRequest = (await reportData(transaction ?? undefined).where(where).first()) ?? null
  return existingRequest?.value
}

module.exports = {
  getValue
}

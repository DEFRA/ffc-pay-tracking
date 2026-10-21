const { reportData } = require('../database')
const { getDataFilter } = require('./get-data-filter')

const getExistingDataFull = async (data, transaction) => {
  if (!data.paymentRequestNumber && data.paymentRequestNumber !== 0) {
    return null
  }
  const where = getDataFilter(data)
  where.correlationId = data.correlationId
  return (await reportData(transaction ?? undefined).where(where).first()) ?? null
}

module.exports = {
  getExistingDataFull
}

const db = require('../data')
const { getDataFilter } = require('./get-data-filter')

const getExistingDataFull = async (data, transaction) => {
  if (!data.paymentRequestNumber && data.paymentRequestNumber !== 0) {
    return null
  }
  const where = getDataFilter(data)
  where.correlationId = data.correlationId
  return db.reportData.findOne({
    where,
    transaction
  })
}

module.exports = {
  getExistingDataFull
}

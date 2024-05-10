const db = require('./data')
const { getDataFilter } = require('./get-data-filter')

const getExistingDataFull = async (data, transaction) => {
  if (!data.paymentRequestNumber) {
    return null
  }
  const where = getDataFilter(data, data.paymentRequestNumber)
  where.correlationId = data.correlationId
  return db.reportData.findOne({
    where,
    transaction
  })
}

module.exports = {
  getExistingDataFull
}

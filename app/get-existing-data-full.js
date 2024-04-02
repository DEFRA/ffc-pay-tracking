const db = require('./data')
const { getDataFilter } = require('./get-data-filter')

const getExistingDataFull = async (data, transaction) => {
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

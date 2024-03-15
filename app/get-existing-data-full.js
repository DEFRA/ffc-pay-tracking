const db = require('./data')

const getExistingDataFull = async (correlationId, sourceSystem, frn, agreementNumber, transaction) => {
  return db.reportData.findOne({
    transaction,
    where: {
      correlationId,
      sourceSystem,
      frn,
      agreementNumber
    }
  })
}

module.exports = {
  getExistingDataFull
}

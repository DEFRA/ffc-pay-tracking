const db = require('../data')

const getExistingDataPartial = async (correlationId, transaction) => {
  return db.reportData.findOne({
    transaction,
    lock: true,
    where: {
      correlationId
    }
  })
}

module.exports = {
  getExistingDataPartial
}

const db = require('../data')

const getExistingReturnMessage = async (referenceId, transaction) => {
  return db.return.findOne({
    transaction,
    lock: true,
    where: {
      referenceId
    }
  })
}

module.exports = {
  getExistingReturnMessage
}

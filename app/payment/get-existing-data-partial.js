const { reportData } = require('../database')

const getExistingDataPartial = async (correlationId, transaction) => {
  return (await reportData(transaction ?? undefined)
    .where({ correlationId })
    .forUpdate()
    .first()) ?? null
}

module.exports = {
  getExistingDataPartial
}

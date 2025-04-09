const db = require('../data')
const { getSourceSystem } = require('../helpers/get-source-system')

const getTransactionSummaryData = async (schemeId, year, paymentRequestNumber, revenueOrCapital, frn) => {
  const sourceSystem = getSourceSystem(schemeId)
  if (!sourceSystem) {
    throw new Error(`Source system not found for schemeId: ${schemeId}`)
  }

  const where = {
    sourceSystem,
    value: {
      [db.Sequelize.Op.ne]: null
    },
    batch: {
      [db.Sequelize.Op.ne]: null
    },
    routedToRequestEditor: {
      [db.Sequelize.Op.ne]: null
    },
    apValue: {
      [db.Sequelize.Op.ne]: null
    },
    arValue: {
      [db.Sequelize.Op.ne]: null
    }
  }

  if (year) {
    where.year = year
  }

  if (paymentRequestNumber) {
    where.paymentRequestNumber = paymentRequestNumber
  }

  if (frn) {
    where.frn = frn
  }

  if (revenueOrCapital) {
    where.revenueOrCapital = revenueOrCapital
  }

  return db.reportData.findAll({
    where,
    raw: true
  })
}

module.exports = {
  getTransactionSummaryData
}

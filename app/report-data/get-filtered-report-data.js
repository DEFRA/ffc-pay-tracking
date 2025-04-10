const db = require('../data')
const { getSourceSystem } = require('../helpers/get-source-system')

const getFilteredReportData = async (schemeId, year, paymentRequestNumber, revenueOrCapital, frn) => {
  const sourceSystem = getSourceSystem(schemeId)
  if (!sourceSystem) {
    throw new Error(`Source system not found for schemeId: ${schemeId}`)
  }

  const where = {
    sourceSystem
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
  getFilteredReportData
}

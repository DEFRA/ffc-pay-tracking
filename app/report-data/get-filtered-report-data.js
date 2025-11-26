const db = require('../data')
const { getSourceSystem } = require('../helpers/get-source-system')
const { generateSqlQuery, exportQueryToJsonFile } = require('./report-file-generator.js')

const generateReportSql = async (sourceSystem, year, paymentRequestNumber, revenueOrCapital, frn, transactionSummary) => {
  const whereClause = {
    sourceSystem,
    value: {
      [db.Sequelize.Op.ne]: null
    }
  }

  if (year) {
    whereClause.year = year
  }

  if (paymentRequestNumber) {
    whereClause.paymentRequestNumber = paymentRequestNumber
  }

  if (frn) {
    whereClause.frn = frn
  }

  if (revenueOrCapital) {
    whereClause.revenueOrCapital = revenueOrCapital
  }

  if (transactionSummary) {
    whereClause.batch = { [db.Sequelize.Op.ne]: null }
    whereClause.routedToRequestEditor = { [db.Sequelize.Op.ne]: null }
    whereClause.apValue = { [db.Sequelize.Op.ne]: null }
    whereClause.arValue = { [db.Sequelize.Op.ne]: null }
  }

  return generateSqlQuery(whereClause)
}

const getFilteredReportData = async (schemeId, year, paymentRequestNumber, revenueOrCapital, frn, transactionSummary = false) => {
  const sourceSystem = getSourceSystem(schemeId)
  if (!sourceSystem) {
    throw new Error(`Source system not found for schemeId: ${schemeId}`)
  }

  const sql = await generateReportSql(sourceSystem, year, paymentRequestNumber, revenueOrCapital, frn, transactionSummary)

  return exportQueryToJsonFile(sql, sourceSystem)
}

module.exports = {
  getFilteredReportData
}

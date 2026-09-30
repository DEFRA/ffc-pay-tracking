const { getSourceSystemFromSchemeId } = require('ffc-pay-schemes')
const { generateSqlQuery, exportQueryToJsonFile } = require('./report-file-generator')
const { UNKNOWN } = require('../constants/unknown')

const generateReportSql = async (sourceSystem, year, paymentRequestNumber, revenueOrCapital, frn, transactionSummary) => {
  const filters = { year, paymentRequestNumber, frn, revenueOrCapital }
  const summaryColumns = ['batch', 'routedToRequestEditor', 'apValue', 'arValue']

  return generateSqlQuery((query) => {
    query.where({ sourceSystem }).whereNotNull('value')

    for (const [column, filter] of Object.entries(filters)) {
      if (filter) {
        query.where(column, filter)
      }
    }

    if (transactionSummary) {
      for (const column of summaryColumns) {
        query.whereNotNull(column)
      }
    }
  })
}

const getFilteredReportData = async (schemeId, year, paymentRequestNumber, revenueOrCapital, frn, transactionSummary = false) => {
  const sourceSystem = getSourceSystemFromSchemeId(Number(schemeId))
  if (sourceSystem === UNKNOWN) {
    throw new Error(`Source system not found for schemeId: ${schemeId}`)
  }

  const sql = await generateReportSql(sourceSystem, year, paymentRequestNumber, revenueOrCapital, frn, transactionSummary)

  return exportQueryToJsonFile(sql, sourceSystem)
}

module.exports = {
  getFilteredReportData
}

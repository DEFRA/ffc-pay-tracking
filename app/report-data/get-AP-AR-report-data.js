const { generateSqlQuery, exportQueryToJsonFile } = require('./report-file-generator')
const { AP } = require('../constants/ledgers')

const getAPARReportData = async (startDate, endDate, ledger) => {
  const valueToCheck = ledger === AP ? 'apValue' : 'arValue'
  const sql = generateSqlQuery((query) => {
    query.whereNotNull(valueToCheck).whereNotNull('daxFileName')
    if (startDate && endDate) {
      query.whereBetween('lastUpdated', [startDate, endDate])
    }
  })
  return exportQueryToJsonFile(sql)
}

module.exports = {
  getAPARReportData
}

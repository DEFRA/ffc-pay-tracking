const db = require('../data')
const { generateSqlQuery, exportQueryToJsonFile } = require('./report-file-generator.js')
const { AP } = require('../constants/ledgers')

const generateReportSql = async (startDate, endDate, ledger) => {
  const valueToCheck = ledger === AP ? 'apValue' : 'arValue'
  const whereClause = {
    [valueToCheck]: { [db.Sequelize.Op.ne]: null },
    lastUpdated: { [db.Sequelize.Op.between]: [startDate, endDate] }
  }

  return generateSqlQuery(whereClause)
}

const getAPARReportData = async (startDate, endDate, ledger) => {
  const sql = await generateReportSql(startDate, endDate, ledger)
  return exportQueryToJsonFile(sql)
}

module.exports = {
  getAPARReportData
}

const db = require('../data')
const { generateSqlQuery, exportQueryToJsonFile } = require('./report-file-generator.js')
const { AP } = require('../constants/ledgers')

const getAPARReportData = async (startDate, endDate, ledger) => {
  const valueToCheck = ledger === AP ? 'apValue' : 'arValue'
  const whereClause = {
    [valueToCheck]: { [db.Sequelize.Op.ne]: null },
    daxFileName: { [db.Sequelize.Op.ne]: null },
    lastUpdated: { [db.Sequelize.Op.between]: [startDate, endDate] }
  }
  const sql = generateSqlQuery(whereClause)
  return exportQueryToJsonFile(sql)
}

module.exports = {
  getAPARReportData
}

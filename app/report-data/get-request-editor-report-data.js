const db = require('../data')
const { generateSqlQuery, exportQueryToJsonFile } = require('./report-file-generator')

const generateReportSql = () => {
  const whereClause = {
    routedToRequestEditor: 'Y',
    receivedInRequestEditor: { [db.Sequelize.Op.ne]: null }
  }

  return generateSqlQuery(whereClause)
}

const getRequestEditorReportData = async () => {
  const sql = generateReportSql()
  return exportQueryToJsonFile(sql)
}

module.exports = {
  getRequestEditorReportData
}

const { generateSqlQuery, exportQueryToJsonFile } = require('./report-file-generator.js')

const generateReportSql = () => {
  const whereClause = {
    routedToRequestEditor: 'Y'
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

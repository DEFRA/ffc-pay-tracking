const { generateSqlQuery, exportQueryToJsonFile } = require('./report-file-generator')

const generateReportSql = () => {
  return generateSqlQuery((query) => query
    .where('routedToRequestEditor', 'Y')
    .whereNotNull('receivedInRequestEditor'))
}

const getRequestEditorReportData = async () => {
  const sql = generateReportSql()
  return exportQueryToJsonFile(sql)
}

module.exports = {
  getRequestEditorReportData
}

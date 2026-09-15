const { generateSqlQuery, exportQueryToJsonFile } = require('./report-file-generator')

const getReportData = async () => {
  const sql = generateSqlQuery()

  return exportQueryToJsonFile(sql)
}

module.exports = {
  getReportData
}

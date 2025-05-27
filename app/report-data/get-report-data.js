const { generateSqlQuery, exportQueryToJsonFile } = require('./report-file-generator.js')

const getReportData = async () => {
  const sql = generateSqlQuery()

  return exportQueryToJsonFile(sql)
}

module.exports = {
  getReportData
}

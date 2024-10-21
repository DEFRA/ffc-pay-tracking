const db = require('../data')

const getRequestEditorReportData = async () => {
  const whereClause = {
    routedToRequestEditor: 'Y'
  }

  return db.reportData.findAll({
    where: whereClause,
    raw: true
  })
}

module.exports = {
  getRequestEditorReportData
}

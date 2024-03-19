const db = require('../data')

const getReportData = async () => {
  return db.reportData.findAll({
    raw: true
  })
}

module.exports = {
    getReportData
}
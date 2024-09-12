const db = require('../data')

const getRequestEditorReportData = async () => {
  const whereClause = {
    receivedInRequestEditor: {
      [db.Sequelize.Op.ne]: null
    },
    releasedFromRequestEditor: null
  }

  return db.reportData.findAll({
    where: whereClause,
    raw: true
  })
}

module.exports = {
  getRequestEditorReportData
}

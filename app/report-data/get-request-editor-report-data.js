const db = require('../data')

const getRequestEditorReportData = async (startDate, endDate) => {
  const whereClause = {
    receivedInRE: {
      [db.Sequelize.Op.ne]: null
    }
  }

  if (startDate && endDate) {
    whereClause.lastUpdated = {
      [db.Sequelize.Op.between]: [startDate, endDate]
    }
  }

  return db.reportData.findAll({
    where: whereClause,
    raw: true
  })
}

module.exports = {
  getRequestEditorReportData
}

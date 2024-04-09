const db = require('../data')

const getARReportData = async (startDate, endDate) => {
  const whereClause = {
    arValue: {
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
  getARReportData
}

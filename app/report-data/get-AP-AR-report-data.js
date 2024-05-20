const { AP } = require('../constants/ledgers')
const db = require('../data')

const getAPARReportData = async (startDate, endDate, ledger) => {
  const valueToCheck = ledger === AP ? 'apValue' : 'arValue'
  const whereClause = {
    [valueToCheck]: {
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
  getAPARReportData
}

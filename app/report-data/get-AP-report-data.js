const db = require('../data')

const getAPReportData = async (startDate, endDate) => {
    let whereClause = {
        apValue: {
            [db.Sequelize.Op.ne]: null
        }
    };

    if (startDate && endDate) {
        whereClause.lastUpdated = {
            [db.Sequelize.Op.between]: [startDate, endDate]
        };
    }

    return db.reportData.findAll({
        where: whereClause,
        raw: true
    })
}

module.exports = {
    getAPReportData
}
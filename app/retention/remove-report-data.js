const db = require('../data')

const removeReportData = async (agreementNumber, frn, sourceSystem, transaction) => {
  await db.reportData.destroy({
    where: { agreementNumber, frn, sourceSystem },
    transaction
  })
}

module.exports = {
  removeReportData
}

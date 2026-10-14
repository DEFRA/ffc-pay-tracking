const { reportData } = require('../database')

const removeReportData = async (agreementNumber, frn, sourceSystem, transaction) => {
  await reportData(transaction ?? undefined).where({ agreementNumber, frn, sourceSystem }).del()
}

module.exports = {
  removeReportData
}

const { getSourceSystemFromSchemeId } = require('ffc-pay-schemes')
const db = require('../data')
const { removeReportData } = require('./remove-report-data')
const { UNKNOWN } = require('../constants/unknown')

const removeAgreementData = async (retentionData) => {
  const transaction = await db.sequelize.transaction()
  try {
    const { agreementNumber, frn, schemeId } = retentionData
    const sourceSystem = getSourceSystemFromSchemeId(schemeId)
    if (sourceSystem === UNKNOWN) {
      throw new Error(`Unknown schemeId: ${schemeId}`)
    }

    await removeReportData(agreementNumber, frn, sourceSystem, transaction)

    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

module.exports = {
  removeAgreementData
}

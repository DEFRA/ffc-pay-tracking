const schemes = require('../constants/schemes')
const sourceSystems = require('../constants/source-systems')
const db = require('../data')
const { removeReportData } = require('./remove-report-data')

const schemeIdToNameMap = Object.entries(schemes)
  .reduce((acc, [key, value]) => {
    acc[value] = key
    return acc
  }, {})

const getSourceSystemBySchemeId = (schemeId) => {
  const schemeName = schemeIdToNameMap[schemeId]
  if (!schemeName) {
    return undefined
  }
  return sourceSystems[schemeName]
}

const removeAgreementData = async (retentionData) => {
  const transaction = await db.sequelize.transaction()
  try {
    const { agreementNumber, frn, schemeId } = retentionData
    const sourceSystem = getSourceSystemBySchemeId(schemeId)
    if (!sourceSystem) {
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

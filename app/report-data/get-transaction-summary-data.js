const db = require('../data')
const schemes = require('../constants/schemes')
const sourceSystems = require('../constants/source-systems')

const getTransactionSummaryData = async (schemeId, frn) => {
  const sourceSystem = getSourceSystem(schemeId)
  if (!sourceSystem) {
    throw new Error(`Source system not found for schemeId: ${schemeId}`)
  }

  const where = {
    sourceSystem
  }
  if (frn) {
    where.frn = frn
  }

  return db.reportData.findAll({
    where,
    raw: true
  })
}

const getSourceSystem = (schemeId) => {
  const schemeIdsToKeys = Object.fromEntries(
    Object.entries(schemes).map(([key, value]) => [value, key])
  )
  const schemeKey = schemeIdsToKeys[schemeId]
  return sourceSystems[schemeKey] || null
}

module.exports = {
  getTransactionSummaryData
}

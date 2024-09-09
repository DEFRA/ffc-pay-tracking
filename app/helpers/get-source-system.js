const schemes = require('../constants/schemes')
const sourceSystems = require('../constants/source-systems')

const getSourceSystem = (schemeId) => {
  const schemeIdsToKeys = Object.fromEntries(
    Object.entries(schemes).map(([key, value]) => [value, key])
  )
  const schemeKey = schemeIdsToKeys[schemeId]
  return sourceSystems[schemeKey] || null
}

module.exports = {
  getSourceSystem
}

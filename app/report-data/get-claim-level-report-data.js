const { BPS, CS, FDMR } = require('../constants/source-systems')
const db = require('../data')
const { getSourceSystem } = require('../helpers/get-source-system')

const getClaimLevelReportData = async (schemeId, year, revenueOrCapital, frn) => {
  const sourceSystem = getSourceSystem(schemeId)
  if (!sourceSystem) {
    throw new Error(`Source system not found for schemeId: ${schemeId}`)
  }
  let additionalProperty1 = 'agreementNumber'
  let additionalProperty2 = 'marketingYear'
  if (sourceSystem === BPS) {
    additionalProperty1 = null
  }
  if (sourceSystem === CS) {
    additionalProperty1 = 'claimNumber'
    additionalProperty2 = null
  }
  if (sourceSystem === FDMR) {
    additionalProperty1 = null
    additionalProperty2 = null
  }

  let whereClause = `
    WHERE "sourceSystem" = :sourceSystem
    AND "year" = :year
  `
  const replacements = {
    sourceSystem,
    year
  }

  if (frn) {
    whereClause += ' AND "frn" = :frn'
    replacements.frn = frn
  }
  if (revenueOrCapital) {
    whereClause += ' AND "revenueOrCapital" = :revenueOrCapital'
    replacements.revenueOrCapital = revenueOrCapital
  }

  return db.sequelize.query(`
  WITH "rankedData" AS (
    SELECT
      *,
      ROW_NUMBER() OVER (
        PARTITION BY
          "sourceSystem",
          frn
          ${additionalProperty1 ? `, "${additionalProperty1}"` : ''}
          ${additionalProperty2 ? `, "${additionalProperty2}"` : ''}
        ORDER BY
          "paymentRequestNumber" DESC,
          "lastUpdated" DESC
      ) AS row_num
    FROM
    "reportData"
    ${whereClause}
  )
  SELECT
    *
  FROM
    "rankedData"
  WHERE
      row_num = 1
`, {
    replacements,
    type: db.sequelize.QueryTypes.SELECT
  })
}

module.exports = {
  getClaimLevelReportData
}

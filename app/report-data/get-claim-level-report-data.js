const { getReportingDataFilter, getSourceSystemFromSchemeId } = require('ffc-pay-schemes')
const { exportQueryToJsonFile } = require('./report-file-generator')
const { UNKNOWN } = require('../constants/unknown')

const generateReportSql = async (schemeId, sourceSystem, year, revenueOrCapital, frn) => {
  let whereClause = `WHERE "sourceSystem" = '${sourceSystem}'`

  if (year) {
    whereClause += ` AND "year" = ${year}`
  }

  if (frn) {
    whereClause += ` AND "frn" = ${frn}`
  }

  if (revenueOrCapital) {
    whereClause += ` AND "revenueOrCapital" = '${revenueOrCapital}'`
  }

  const partitionColumns = ['"sourceSystem"', 'frn']
  const additionalProperties = getReportingDataFilter(schemeId)
  for (const property of additionalProperties) {
    partitionColumns.push(`"${property}"`)
  }

  const partitionClause = `PARTITION BY ${partitionColumns.join(', ')}`

  return `WITH "rankedData" AS (
      SELECT
        *,
        ROW_NUMBER() OVER (
          ${partitionClause}
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
      row_num = 1`
}

const getClaimLevelReportData = async (schemeId, year, revenueOrCapital, frn) => {
  const sourceSystem = getSourceSystemFromSchemeId(schemeId)
  if (sourceSystem === UNKNOWN) {
    throw new Error(`Source system not found for schemeId: ${schemeId}`)
  }

  const sql = await generateReportSql(schemeId, sourceSystem, year, revenueOrCapital, frn)

  return exportQueryToJsonFile(sql, sourceSystem)
}

module.exports = {
  getClaimLevelReportData
}

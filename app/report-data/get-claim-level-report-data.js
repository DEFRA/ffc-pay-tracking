const { BPS, CS, FDMR } = require('../constants/source-systems')
const { getSourceSystem } = require('../helpers/get-source-system')
const { exportQueryToJsonFile } = require('./report-file-generator')

const generateReportSql = async (sourceSystem, year, revenueOrCapital, frn) => {
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
  if (additionalProperty1) partitionColumns.push(`"${additionalProperty1}"`)
  if (additionalProperty2) partitionColumns.push(`"${additionalProperty2}"`)

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
  const sourceSystem = getSourceSystem(schemeId)
  if (!sourceSystem) {
    throw new Error(`Source system not found for schemeId: ${schemeId}`)
  }

  const sql = await generateReportSql(sourceSystem, year, revenueOrCapital, frn)

  return exportQueryToJsonFile(sql, sourceSystem)
}

module.exports = {
  getClaimLevelReportData
}

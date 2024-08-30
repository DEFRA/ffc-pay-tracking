const { bps, cs, fdmr } = require('../constants/source-systems')
const db = require('../data')

const getClaimLevelReportData = async () => {
  return db.sequelize.query(`
  WITH "rankedData" AS (
    SELECT
      *,
      ROW_NUMBER() OVER (
        PARTITION BY
          "sourceSystem",
          frn,
          CASE 
              WHEN "sourceSystem" = :BPS THEN NULL
              WHEN "sourceSystem" = :FDMR THEN NULL
              WHEN "sourceSystem" = :CS THEN "claimNumber"
              ELSE "agreementNumber"
          END,
          CASE
            WHEN "sourceSystem" = :FDMR THEN NULL
            WHEN "sourceSystem" = :CS THEN NULL
            ELSE "marketingYear"
          END
        ORDER BY
          "paymentRequestNumber" DESC,
          "lastUpdated" DESC
      ) AS row_num
    FROM
    "reportData"
  )
  SELECT
    *
  FROM
    "rankedData"
  WHERE
      row_num = 1
`, {
    replacements: {
      BPS: bps,
      CS: cs,
      FDMR: fdmr
    },
    type: db.sequelize.QueryTypes.SELECT
  })
}

module.exports = {
  getClaimLevelReportData
}

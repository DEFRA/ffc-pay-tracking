const { bps, cs, fdmr } = require('../constants/source-systems');
const db = require('../data')

const getClaimLevelReportData = async (startDate, endDate) => {
  
  let startDateEndDate = '';
  if (startDate && endDate) {
    startDateEndDate = `WHERE "lastUpdated" BETWEEN '${startDate}' AND '${endDate}'`
}
  const reportDataIdsResult = await db.sequelize.query(`
  SELECT rd."reportDataId"
  FROM "reportData" rd
  INNER JOIN (
    SELECT 
      "sourceSystem", 
      "frn",
      CASE
        WHEN "sourceSystem" = :CS THEN CAST("claimNumber" AS VARCHAR)
        WHEN "sourceSystem" = :FDMR THEN NULL
        ELSE CAST("marketingYear" AS VARCHAR)
      END AS marketingYear,
      CASE
        WHEN "sourceSystem" = :BPS THEN NULL
        WHEN "sourceSystem" = :FDMR THEN NULL
        WHEN "sourceSystem" = :CS THEN NULL
        ELSE CAST("agreementNumber" AS VARCHAR)
      END AS agreementNumber,
      MAX("paymentRequestNumber") AS maxPaymentRequestNumber
    FROM "reportData"
    ${startDateEndDate}
    GROUP BY 
      "sourceSystem", 
      "frn",
      marketingYear,
      agreementNumber
  ) sub
  ON rd."sourceSystem" = sub."sourceSystem"
  AND rd."frn" = sub."frn"
  AND CAST(rd."marketingYear" AS VARCHAR) = sub.marketingYear
  AND CAST(rd."agreementNumber" AS VARCHAR) = sub.agreementNumber
  AND rd."paymentRequestNumber" = sub.maxPaymentRequestNumber
`, {
  replacements: {
    BPS:bps,
    CS: cs,
    FDMR: fdmr
  },
  raw: true
})
  console.log(reportDataIdsResult)
  const reportDataIds = reportDataIdsResult[0].map(result => result.reportDataId);

  console.log(reportDataIds)

  return db.reportData.findAll({
    where: {
      reportDataId: {
        [db.Sequelize.Op.in]: reportDataIds
      }
    },
    raw: true
  })
}
module.exports = {
  getClaimLevelReportData
}

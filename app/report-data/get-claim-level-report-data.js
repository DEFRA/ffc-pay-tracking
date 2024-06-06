const db = require('../data')
const { bps, cs, fdmr } = require('../constants/source-systems')

const getClaimLevelReportData = async () => {
  const reportDataIds = await db.sequelize.query(`
    SELECT 
      reportDataId
    FROM reportData
    GROUP BY 
      sourceSystem, 
      frn,
      CASE
        WHEN sourceSystem = :CS THEN claimNumber
        WHEN sourceSystem = :FDMR THEN NULL
        ELSE marketingYear
      END,
      CASE
        WHEN sourceSystem = :BPS THEN NULL
        WHEN sourceSystem = :FDMR THEN NULL
        WHEN sourceSystem = :CS THEN NULL
        ELSE agreementNumber
      END
    HAVING paymentRequestNumber = MAX(paymentRequestNumber)
  `, {
    replacements: {
      BPS: bps,
      CS: cs,
      FDMR: fdmr
    },
    raw: true
  })

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

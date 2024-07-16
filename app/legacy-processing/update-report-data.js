const db = require('../data')
const { getLegacyFilter } = require('./get-legacy-filter')
const { updatePaymentRequestData } = require('./update-payment-request-data')

const updateReportData = async (data, schemeId) => {
  const reportDataExtract = await db.reportData.create({ ...data })
  const where = getLegacyFilter(reportDataExtract, schemeId)
  const relatedRequests = await db.reportData.findAll({
    where
  })
  if (relatedRequests.length) {
    for (const paymentRequest of relatedRequests) {
      await updatePaymentRequestData(paymentRequest, reportDataExtract)
    }
  }
}

module.exports = {
  updateReportData
}

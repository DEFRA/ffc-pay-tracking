const db = require('../data')
const { getLegacyFilter } = require('./get-legacy-filter')
const { updatePaymentRequestData } = require('./update-payment-request-data')

const updateReportData = async (data, schemeId) => {
  const where = getLegacyFilter(data, schemeId)
  const relatedRequests = await db.reportData.findAll({
    where
  })
  if (!relatedRequests.length) {
    await db.reportData.create({ ...data })
  } else {
    for (const paymentRequest of relatedRequests) {
      await updatePaymentRequestData(paymentRequest, data)
    }
  }
}

module.exports = {
  updateReportData
}

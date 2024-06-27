const db = require('../data')
const { getDataFilter } = require('../get-data-filter')
const { updatePaymentRequestData } = require('./update-payment-request-data')

const updateReportData = async (data) => {
  const where = getDataFilter(data)
  delete where.paymentRequestNumber
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

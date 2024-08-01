const util = require('util')
const api = require('../api')
const { processingConfig } = require('../config')
const { processLegacyPaymentRequest } = require('./process-legacy-payment-request')

const processLegacyPayments = async () => {
  try {
    const response = await api.get(`/tracking-migration?limit=${processingConfig.processingCap}`)
    const paymentRequestsBatch = response.payload.paymentRequestsBatch
    for (const paymentRequest of paymentRequestsBatch) {
      console.log('Processing received payment request:', util.inspect(paymentRequest, false, null, true))
      // in some cases there could be two or more completed payment requests related to a payment request.
      // if this is the case, we want to process these individually as copies of the same PR.
      if (paymentRequest.completedPaymentRequests && paymentRequest.completedPaymentRequests.length > 0) {
        for (const completedRequest of paymentRequest.completedPaymentRequests) {
          const newPaymentRequest = {
            ...paymentRequest,
            completedPaymentRequests: [completedRequest]
          }
          await processLegacyPaymentRequest(newPaymentRequest)
        }
      } else {
        await processLegacyPaymentRequest(paymentRequest)
      }
    }
  } catch (error) {
    console.error('Failed to fetch legacy payment request data:', error)
  }
}

module.exports = {
  processLegacyPayments
}

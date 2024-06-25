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
      await processLegacyPaymentRequest(paymentRequest)
    }
  } catch (error) {
    console.error('Failed to fetch legacy payment request data:', error)
  }
}

module.exports = {
  processLegacyPayments
}

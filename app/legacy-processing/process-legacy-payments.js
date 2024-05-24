const api = require('../api')
const { processingConfig } = require('../config')
const { processLegacyPaymentRequest } = require('./process-legacy-payment-request')

const processLegacyPayments = async () => {
  try {
    const response = await api.get(`/tracking-migration?limit=${processingConfig.processingCap}`)
    const paymentRequestsBatch = response.payload.paymentRequestsBatch
    console.log(paymentRequestsBatch)
    const processedEntries = new Set()
    for (const paymentRequest of paymentRequestsBatch) {
      if (!processedEntries.has(`${paymentRequest.correlationId}-${paymentRequest.frn}-${paymentRequest.invoiceNumber}`) && paymentRequest.invalid !== 'TRUE') {
        processedEntries.add(`${paymentRequest.correlationId}-${paymentRequest.frn}-${paymentRequest.invoiceNumber}`)
        const relatedPaymentRequests = paymentRequestsBatch.filter(pr => pr.correlationId === paymentRequest.correlationId && pr.frn === paymentRequest.frn && pr !== paymentRequest)
        await processLegacyPaymentRequest(paymentRequest, relatedPaymentRequests)
      }
    }
  } catch (error) {
    console.error('Failed to fetch legacy payment request data:', error)
  }
}

module.exports = {
  processLegacyPayments
}

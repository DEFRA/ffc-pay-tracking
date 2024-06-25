const calculateApproximateREReceivedDateTime = (primaryPaymentRequest, paymentRequest) => {
  if (primaryPaymentRequest.debtType || !paymentRequest.completedPaymentRequests[0]) {
    return paymentRequest.completedPaymentRequests[0]?.submitted < paymentRequest.received ? paymentRequest.completedPaymentRequests[0]?.submitted : paymentRequest.received
  }
  return null
}

module.exports = {
  calculateApproximateREReceivedDateTime
}

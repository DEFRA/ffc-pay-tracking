const calculateApproximateREReceivedDateTime = (primaryPaymentRequest, paymentRequest) => {
  if (primaryPaymentRequest.paymentRequestNumber <= 1) {
    return null
  }
  if (primaryPaymentRequest.debtType && paymentRequest.completedPaymentRequests?.[0]) {
    return paymentRequest.completedPaymentRequests[0].submitted < paymentRequest.received ? paymentRequest.completedPaymentRequests[0].submitted : paymentRequest.received
  }
  if (primaryPaymentRequest.debtType || !paymentRequest.completedPaymentRequests?.[0]) {
    return paymentRequest.received
  }
  return null
}

module.exports = {
  calculateApproximateREReceivedDateTime
}

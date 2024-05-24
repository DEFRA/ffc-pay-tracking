const calculateApproximateREReceivedDateTime = (primaryPaymentRequest, paymentRequest) => {
  if (primaryPaymentRequest.debtType || !paymentRequest.completedPaymentRequest) {
    return paymentRequest.received
  }
  return null
}

module.exports = {
  calculateApproximateREReceivedDateTime
}

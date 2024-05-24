const getLastUpdatedDate = (paymentRequest) => {
  if (paymentRequest.completedPaymentRequest) {
    return paymentRequest.completedPaymentRequest.lastSettlement ?? paymentRequest.completedPaymentRequest.submitted
  }
  return paymentRequest.received
}

module.exports = {
  getLastUpdatedDate
}

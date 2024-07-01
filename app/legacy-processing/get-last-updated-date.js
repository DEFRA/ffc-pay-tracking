const getLastUpdatedDate = (paymentRequest) => {
  if (paymentRequest.completedPaymentRequests?.[0]) {
    return paymentRequest.completedPaymentRequests[0].lastSettlement ?? paymentRequest.completedPaymentRequests[0].submitted
  }
  return paymentRequest.received
}

module.exports = {
  getLastUpdatedDate
}

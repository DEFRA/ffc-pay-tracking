const calculateDeltaAmount = (paymentRequest) => {
  return paymentRequest.completedPaymentRequests[0] ? paymentRequest.completedPaymentRequests[0].value : null
}

module.exports = {
  calculateDeltaAmount
}

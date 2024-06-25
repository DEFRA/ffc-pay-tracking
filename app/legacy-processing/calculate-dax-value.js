const calculateDAXValue = (paymentRequest) => {
  return paymentRequest.completedPaymentRequests[0]?.acknowledged ? paymentRequest.completedPaymentRequests[0].value : 0
}

module.exports = {
  calculateDAXValue
}

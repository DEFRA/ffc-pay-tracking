const calculateDAXValue = (deltaAmount, paymentRequest) => {
  return paymentRequest.completedPaymentRequests?.[0]?.acknowledged ? deltaAmount : 0
}

module.exports = {
  calculateDAXValue
}

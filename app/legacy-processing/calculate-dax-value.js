const calculateDAXValue = (paymentRequest, relatedPaymentRequests) => {
  let daxValue = 0
  if (paymentRequest.completedPaymentRequest?.acknowledged) {
    daxValue += paymentRequest.completedPaymentRequest.value
  }
  for (const relatedPaymentRequest of relatedPaymentRequests) {
    if (relatedPaymentRequest.completedPaymentRequest?.acknowledged) {
      daxValue += relatedPaymentRequest.completedPaymentRequest.value
    }
  }
  return daxValue
}

module.exports = {
  calculateDAXValue
}

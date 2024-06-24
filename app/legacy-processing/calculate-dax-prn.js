const calculateDAXPRN = (paymentRequest, relatedPaymentRequests) => {
  if (paymentRequest.completedPaymentRequest?.acknowledged) {
    return paymentRequest.paymentRequestNumber 
  }
  relatedPaymentRequests.sort((a, b) => b.paymentRequestNumber - a.paymentRequestNumber)
  for (const relatedPaymentRequest of relatedPaymentRequests) {
    if (relatedPaymentRequest.completedPaymentRequest?.acknowledged) {
      return relatedPaymentRequest.paymentRequestNumber
    }
  }
  return 0
}

module.exports = {
  calculateDAXPRN
}

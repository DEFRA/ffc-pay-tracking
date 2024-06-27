const calculateDAXPRN = (paymentRequest, relatedPaymentRequests) => {
  return paymentRequest.completedPaymentRequests?.[0]?.acknowledged ? paymentRequest.paymentRequestNumber : 0
}

module.exports = {
  calculateDAXPRN
}

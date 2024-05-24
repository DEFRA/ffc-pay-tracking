const calculateDeltaAmount = (paymentRequest, relatedPaymentRequests) => {
  if (!paymentRequest.completedPaymentRequest) {
    return null
  }
  let deltaAmount = Number(paymentRequest.completedPaymentRequest.value)
  if (relatedPaymentRequests) {
    relatedPaymentRequests.forEach(relatedPaymentRequest => {
      deltaAmount += Number(relatedPaymentRequest.completedPaymentRequest?.value)
    })
  }
  return deltaAmount
}

module.exports = {
  calculateDeltaAmount
}

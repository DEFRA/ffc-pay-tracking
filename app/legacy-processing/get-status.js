const getStatus = (paymentRequest) => {
  if (paymentRequest.completedPaymentRequest?.ledger === 'AP' && paymentRequest.completedPaymentRequest?.settledValue) {
    return 'Settled by payment ledger'
  } else if (paymentRequest.completedPaymentRequest?.acknowledged) {
    return 'Acknowledged by payment ledger'
  } else if (paymentRequest.completedPaymentRequest) {
    return 'Submitted to payment ledger'
  } else if (paymentRequest.debtType) {
    return 'Waiting for ledger assignment'
  }
  return 'Waiting for debt data'
}

module.exports = {
  getStatus
}

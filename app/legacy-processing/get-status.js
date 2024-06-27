const getStatus = (paymentRequest) => {
  if (paymentRequest.completedPaymentRequests?.[0]?.ledger === 'AP' && paymentRequest.completedPaymentRequests[0]?.settledValue) {
    return 'Settled by payment ledger'
  } else if (paymentRequest.completedPaymentRequests?.[0]?.acknowledged) {
    return 'Acknowledged by payment ledger'
  } else if (paymentRequest.completedPaymentRequests?.[0]) {
    return 'Submitted to payment ledger'
  } else if (paymentRequest.debtType) {
    return 'Waiting for ledger assignment'
  }
  return 'Waiting for debt data'
}

module.exports = {
  getStatus
}

const getStatusDaxImported = (paymentRequest) => {
  const fields = { }
  if (paymentRequest.completedPaymentRequests?.[0]?.ledger === 'AP' && paymentRequest.completedPaymentRequests[0]?.settledValue) {
    fields.status = 'Settled by payment ledger'
    fields.daxImported = 'Y'
  } else if (paymentRequest.completedPaymentRequests?.[0]?.acknowledged) {
    fields.status = 'Acknowledged by payment ledger'
    fields.daxImported = 'Y'
  } else if (paymentRequest.completedPaymentRequests?.[0]) {
    fields.status = 'Submitted to payment ledger'
  } else if (paymentRequest.debtType) {
    fields.status = 'Waiting for ledger assignment'
  } else {
    fields.status = 'Waiting for debt data'
  }
  return fields
}

module.exports = {
  getStatusDaxImported
}

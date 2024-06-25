const calculateLedgerValue = (paymentRequest, ledger) => {
  if (paymentRequest.completedPaymentRequests[0]?.ledger === ledger) {
    return Number(paymentRequest.completedPaymentRequests[0].value)
  }
  return 0
}

module.exports = {
  calculateLedgerValue
}

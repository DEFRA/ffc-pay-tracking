const calculateLedgerValue = (paymentRequest, ledger) => {
  if (paymentRequest.completedPaymentRequest?.ledger === ledger) {
    return Number(paymentRequest.completedPaymentRequest.value)
  }
  return 0
}

module.exports = {
  calculateLedgerValue
}

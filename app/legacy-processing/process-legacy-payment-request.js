const db = require('../data')
const { AP, AR } = require('../constants/ledgers')
const { getExistingDataFull } = require('../get-existing-data-full')
const { calculateApproximateREReceivedDateTime } = require('./calculate-approximate-re-received-datetime')
const { calculateDeltaAmount } = require('./calculate-delta-amount')
const { calculateLedgerValue } = require('./calculate-ledger-value')
const { checkIfRevenueOrCapital } = require('./check-if-revenue-or-capital')
const { getLastUpdatedDate } = require('./get-last-updated-date')
const { getStatus } = require('./get-status')
const { getYear } = require('./get-year')

const processLegacyPaymentRequest = async (paymentRequest, relatedPaymentRequests) => {
  const primaryPaymentRequest = paymentRequest.completedPaymentRequest ?? paymentRequest
  const status = getStatus(paymentRequest)
  const lastUpdated = getLastUpdatedDate(paymentRequest)
  const revenueOrCapital = checkIfRevenueOrCapital(primaryPaymentRequest)
  const year = getYear(primaryPaymentRequest, revenueOrCapital)
  const deltaAmount = calculateDeltaAmount(paymentRequest, relatedPaymentRequests)
  const apValue = calculateLedgerValue(paymentRequest, AP)
  const arValue = calculateLedgerValue(paymentRequest, AR)
  const receivedInRequestEditor = calculateApproximateREReceivedDateTime(primaryPaymentRequest, paymentRequest)
  const data = {
    correlationId: primaryPaymentRequest.correlationId,
    frn: primaryPaymentRequest.frn,
    claimNumber: primaryPaymentRequest.contractNumber,
    agreementNumber: primaryPaymentRequest.agreementNumber,
    marketingYear: primaryPaymentRequest.marketingYear,
    originalInvoiceNumber: null,
    invoiceNumber: primaryPaymentRequest.invoiceNumber,
    currency: primaryPaymentRequest.currency,
    paymentRequestNumber: primaryPaymentRequest.paymentRequestNumber,
    value: paymentRequest.value,
    batch: primaryPaymentRequest.batch,
    sourceSystem: primaryPaymentRequest.sourceSystem,
    batchExportDate: null,
    status,
    lastUpdated,
    revenueOrCapital,
    year,
    routedToRequestEditor: primaryPaymentRequest.debtType ? 'Y' : 'N',
    deltaAmount,
    apValue,
    arValue,
    debtType: primaryPaymentRequest.debtType,
    daxFileName: null,
    daxImported: paymentRequest.completedPaymentRequest?.acknowledged ? 'Y' : 'N',
    settledValue: primaryPaymentRequest.settledValue,
    phError: null,
    daxError: null,
    receivedInRequestEditor,
    enriched: primaryPaymentRequest.debtType ? 'Y' : null,
    ledgerSplit: apValue && arValue ? 'Y' : 'N',
    releasedFromRequestEditor: paymentRequest.completedPaymentRequest?.submitted
  }
  const existingData = await getExistingDataFull(data)
  if (!existingData) {
    await db.reportData.create({ ...data })
  }
}

module.exports = {
  processLegacyPaymentRequest
}

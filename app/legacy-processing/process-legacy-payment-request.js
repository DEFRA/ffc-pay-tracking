const { AP, AR } = require('../constants/ledgers')
const { calculateApproximateREReceivedDateTime } = require('./calculate-approximate-re-received-datetime')
const { calculateDeltaAmount } = require('./calculate-delta-amount')
const { calculateLedgerValue } = require('./calculate-ledger-value')
const { checkIfRevenueOrCapital } = require('./check-if-revenue-or-capital')
const { getLastUpdatedDate } = require('./get-last-updated-date')
const { getStatus } = require('./get-status')
const { getYear } = require('./get-year')
const { calculateDAXPRN } = require('./calculate-dax-prn')
const { calculateDAXValue } = require('./calculate-dax-value')
const { getOverallStatus } = require('../data-generation')
const { checkCrossBorderType } = require('./check-cross-border-type')
const { updateReportData } = require('./update-report-data')

const processLegacyPaymentRequest = async (paymentRequest) => {
  const primaryPaymentRequest = paymentRequest.completedPaymentRequests?.[0] ?? paymentRequest
  const apValue = calculateLedgerValue(paymentRequest, AP)
  const arValue = calculateLedgerValue(paymentRequest, AR)
  const daxPaymentRequestNumber = calculateDAXPRN(paymentRequest)
  const deltaAmount = calculateDeltaAmount(paymentRequest)
  const daxValue = calculateDAXValue(deltaAmount, paymentRequest)
  const routedToRequestEditor = primaryPaymentRequest.debtType ? 'Y' : 'N'
  const data = {
    correlationId: paymentRequest.correlationId,
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
    status: getStatus(paymentRequest),
    lastUpdated: getLastUpdatedDate(paymentRequest),
    revenueOrCapital: checkIfRevenueOrCapital(primaryPaymentRequest),
    year: getYear(primaryPaymentRequest, checkIfRevenueOrCapital(primaryPaymentRequest)),
    routedToRequestEditor,
    deltaAmount,
    apValue,
    arValue,
    debtType: primaryPaymentRequest.debtType,
    daxFileName: null,
    daxImported: paymentRequest.completedPaymentRequests?.[0]?.acknowledged ? 'Y' : 'N',
    settledValue: primaryPaymentRequest.settledValue,
    phError: null,
    daxError: null,
    receivedInRequestEditor: calculateApproximateREReceivedDateTime(primaryPaymentRequest, paymentRequest),
    enriched: primaryPaymentRequest.debtType ? 'Y' : null,
    ledgerSplit: apValue && arValue ? 'Y' : 'N',
    releasedFromRequestEditor: routedToRequestEditor === 'Y' ? paymentRequest.completedPaymentRequests?.[0]?.submitted : null,
    daxPaymentRequestNumber,
    daxValue,
    overallStatus: getOverallStatus(paymentRequest.value, daxValue, primaryPaymentRequest.paymentRequestNumber, daxPaymentRequestNumber),
    crossBorderFlag: checkCrossBorderType(paymentRequest),
    valueStillToProcess: paymentRequest.value - daxValue,
    prStillToProcess: primaryPaymentRequest.paymentRequestNumber - daxPaymentRequestNumber
  }
  await updateReportData(data, paymentRequest.schemeId)
}

module.exports = {
  processLegacyPaymentRequest
}

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
const { calculateDAXPRN } = require('./calculate-dax-prn')
const { calculateDAXValue } = require('./calculate-dax-value')
const { getOverallStatus } = require('../data-generation')

const processLegacyPaymentRequest = async (paymentRequest, relatedPaymentRequests) => {
  const primaryPaymentRequest = paymentRequest.completedPaymentRequest ?? paymentRequest
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
    status: getStatus(paymentRequest),
    lastUpdated: getLastUpdatedDate(paymentRequest),
    revenueOrCapital: checkIfRevenueOrCapital(primaryPaymentRequest),
    year: getYear(primaryPaymentRequest, checkIfRevenueOrCapital(primaryPaymentRequest)),
    routedToRequestEditor: primaryPaymentRequest.debtType ? 'Y' : 'N',
    deltaAmount: calculateDeltaAmount(paymentRequest, relatedPaymentRequests),
    apValue: calculateLedgerValue(paymentRequest, AP),
    arValue: calculateLedgerValue(paymentRequest, AR),
    debtType: primaryPaymentRequest.debtType,
    daxFileName: null,
    daxImported: paymentRequest.completedPaymentRequest?.acknowledged ? 'Y' : 'N',
    settledValue: primaryPaymentRequest.settledValue,
    phError: null,
    daxError: null,
    receivedInRequestEditor: calculateApproximateREReceivedDateTime(primaryPaymentRequest, paymentRequest),
    enriched: primaryPaymentRequest.debtType ? 'Y' : null,
    ledgerSplit: apValue && arValue ? 'Y' : 'N',
    releasedFromRequestEditor: paymentRequest.completedPaymentRequest?.submitted,
    daxPaymentRequestNumber: calculateDAXPRN(paymentRequest, relatedPaymentRequests),
    daxValue: calculateDAXValue(paymentRequest, relatedPaymentRequests),
    overallStatus: getOverallStatus(paymentRequest.value, calculateDAXValue(paymentRequest, relatedPaymentRequests), primaryPaymentRequest.paymentRequestNumber, calculateDAXPRN(paymentRequest, relatedPaymentRequests)),
    //crossBorderFlag: check tomorrow,
    valueStillToProcess: paymentRequest.value - calculateDAXValue(paymentRequest, relatedPaymentRequests),
    prStillToProcess: primaryPaymentRequest.paymentRequestNumber - calculateDAXPRN(paymentRequest, relatedPaymentRequests)
  }

  const existingData = await getExistingDataFull(data)
  if (!existingData) {
    await db.reportData.create({ ...data })
  }
}

module.exports = {
  processLegacyPaymentRequest
}

const { AP, AR } = require('../constants/ledgers')
const { calculateApproximateREReceivedDateTime } = require('./calculate-approximate-re-received-datetime')
const { calculateDeltaAmount } = require('./calculate-delta-amount')
const { calculateLedgerValue } = require('./calculate-ledger-value')
const { checkIfRevenueOrCapital } = require('./check-if-revenue-or-capital')
const { getLastUpdatedDate } = require('./get-last-updated-date')
const { getStatusDaxImported } = require('./get-status-dax-imported')
const { getYear } = require('./get-year')
const { calculateDAXPRN } = require('./calculate-dax-prn')
const { calculateDAXValue } = require('./calculate-dax-value')
const { getOverallStatus } = require('../data-generation')
const { checkCrossBorderType } = require('./check-cross-border-type')
const { updateReportData } = require('./update-report-data')
const { FDMR } = require('../constants/schemes')
const { CS, BPS } = require('../constants/source-systems')

const formatDebtType = (type) => {
  if (type === 'irr') {
    return 'Irregular'
  }
  if (type === 'adm') {
    return 'Administrative'
  }
  return null
}

const formatEnriched = (debtType, routedToRequestEditor) => {
  if (debtType) {
    return 'Y'
  }
  if (routedToRequestEditor === 'Y') {
    return 'N'
  }
  return null
}

const determineRoutedToRequestEditor = (primaryPaymentRequest) => {
  return (primaryPaymentRequest.debtType || !primaryPaymentRequest.completedPaymentRequests?.[0]) && primaryPaymentRequest.paymentRequestNumber > 1 ? 'Y' : 'N'
}

const determineReleasedFromRequestEditor = (routedToRequestEditor, primaryPaymentRequest, paymentRequest) => {
  return routedToRequestEditor === 'Y' && ![CS, BPS].includes(primaryPaymentRequest.sourceSystem)
    ? paymentRequest.completedPaymentRequests?.[0]?.submitted
    : null
}

const processLegacyPaymentRequest = async (paymentRequest) => {
  const primaryPaymentRequest = paymentRequest.completedPaymentRequests?.[0] ?? paymentRequest
  const apValue = calculateLedgerValue(paymentRequest, AP)
  const arValue = calculateLedgerValue(paymentRequest, AR)
  const daxPaymentRequestNumber = calculateDAXPRN(paymentRequest)
  const deltaAmount = calculateDeltaAmount(paymentRequest)
  const daxValue = calculateDAXValue(deltaAmount, paymentRequest)
  const routedToRequestEditor = determineRoutedToRequestEditor(primaryPaymentRequest)
  const { status, daxImported } = getStatusDaxImported(paymentRequest)

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
    status,
    lastUpdated: getLastUpdatedDate(paymentRequest),
    revenueOrCapital: checkIfRevenueOrCapital(primaryPaymentRequest),
    year: getYear(primaryPaymentRequest, checkIfRevenueOrCapital(primaryPaymentRequest)),
    routedToRequestEditor,
    deltaAmount,
    apValue,
    arValue,
    debtType: formatDebtType(primaryPaymentRequest.debtType),
    daxFileName: null,
    daxImported,
    settledValue: primaryPaymentRequest.settledValue,
    phError: null,
    daxError: null,
    receivedInRequestEditor: calculateApproximateREReceivedDateTime(primaryPaymentRequest, paymentRequest),
    enriched: formatEnriched(primaryPaymentRequest.debtType, routedToRequestEditor),
    ledgerSplit: apValue && arValue ? 'Y' : 'N',
    releasedFromRequestEditor: determineReleasedFromRequestEditor(routedToRequestEditor, primaryPaymentRequest, paymentRequest),
    daxPaymentRequestNumber,
    daxValue,
    overallStatus: getOverallStatus(paymentRequest.value, daxValue, primaryPaymentRequest.paymentRequestNumber, daxPaymentRequestNumber),
    crossBorderFlag: checkCrossBorderType(paymentRequest),
    valueStillToProcess: paymentRequest.value - daxValue,
    prStillToProcess: primaryPaymentRequest.paymentRequestNumber - daxPaymentRequestNumber,
    fdmrSchemeCode: paymentRequest.schemeId === FDMR ? paymentRequest.invoiceLines[0].schemeCode : null
  }

  await updateReportData(data, paymentRequest.schemeId)
}

module.exports = {
  processLegacyPaymentRequest
}

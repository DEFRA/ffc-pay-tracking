const moment = require('moment')
const { getARAmount, getDebtType, getFileName, getBatch, getBatchExportDate, getStatus, getValue, getRevenue, getYear, routedToRequestEditor, getDeltaAmount, getAPAmount, isImported, getSettledValue, getOriginalInvoiceNumber, getRequestEditorDate, isEnriched, getRequestEditorReleased, checkDAXPRN, checkDAXValue, getOverallStatus, getCrossBorderFlag } = require('../data-generation')

const createData = async (event, transaction) => {
  const paymentRequestNumber = event.data.paymentRequestNumber
  const value = await getValue(event)
  const deltaAmount = await getDeltaAmount(event, transaction)
  const daxPaymentRequestNumber = await checkDAXPRN(event, transaction)
  const daxValue = await checkDAXValue(event, transaction)
  const data = {
    correlationId: event.data.correlationId,
    frn: event.data.frn,
    claimNumber: event.data.contractNumber,
    agreementNumber: event.data.agreementNumber,
    marketingYear: event.data.marketingYear,
    originalInvoiceNumber: getOriginalInvoiceNumber(event),
    invoiceNumber: event.data.invoiceNumber,
    currency: event.data.currency,
    paymentRequestNumber,
    value,
    batch: getBatch(event),
    sourceSystem: event.data.sourceSystem,
    batchExportDate: getBatchExportDate(event),
    status: getStatus(event),
    lastUpdated: moment(event.time).format(),
    revenueOrCapital: getRevenue(event),
    year: getYear(event),
    routedToRequestEditor: routedToRequestEditor(event),
    deltaAmount,
    apValue: getAPAmount(event),
    arValue: getARAmount(event),
    debtType: getDebtType(event),
    daxFileName: getFileName(event),
    daxImported: isImported(event),
    settledValue: getSettledValue(event),
    receivedInRequestEditor: getRequestEditorDate(event),
    enriched: isEnriched(event),
    releasedFromRequestEditor: getRequestEditorReleased(event),
    daxPaymentRequestNumber,
    daxValue,
    overallStatus: getOverallStatus(value, daxValue, paymentRequestNumber, daxPaymentRequestNumber),
    crossBorderFlag: getCrossBorderFlag(event),
    valueStillToProcess: value ? value - daxValue : null,
    prStillToProcess: paymentRequestNumber - daxPaymentRequestNumber
  }
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key, value]) => value !== null)
  )
  filteredData.phError = null
  filteredData.daxError = null
  return filteredData
}

module.exports = {
  createData
}

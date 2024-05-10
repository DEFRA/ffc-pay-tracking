const moment = require('moment')
const { getARAmount, getDebtType, getFileName, getBatch, getBatchExportDate, getStatus, getValue, getRevenue, getYear, routedToRequestEditor, getDeltaAmount, getAPAmount, isImported, getSettledValue, getOriginalInvoiceNumber, getRequestEditorDate, isEnriched, getRequestEditorReleased } = require('../data-generation')

const createData = async (event, transaction) => {
  const deltaAmount = await getDeltaAmount(event, transaction)
  const data = {
    correlationId: event.data.correlationId,
    frn: event.data.frn,
    claimNumber: event.data.contractNumber,
    agreementNumber: event.data.agreementNumber,
    marketingYear: event.data.marketingYear,
    originalInvoiceNumber: getOriginalInvoiceNumber(event),
    invoiceNumber: event.data.invoiceNumber,
    currency: event.data.currency,
    paymentRequestNumber: event.data.paymentRequestNumber,
    value: getValue(event),
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
    receivedInRE: getRequestEditorDate(event),
    enriched: isEnriched(event),
    releasedFromRE: getRequestEditorReleased(event)
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

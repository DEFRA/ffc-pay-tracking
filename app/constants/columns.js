const TABLES = require('./tables')

const COLUMNS = {
  [TABLES.reportData]: [
    'reportDataId',
    'correlationId',
    'frn',
    'contractNumber',
    'agreementNumber',
    'marketingYear',
    'originalInvoiceNumber',
    'invoiceNumber',
    'currency',
    'paymentRequestNumber',
    'value',
    'batch',
    'sourceSystem',
    'batchExportDate',
    'status',
    'lastUpdated',
    'revenueOrCapital',
    'year',
    'routedToRequestEditor',
    'deltaAmount',
    'apValue',
    'arValue',
    'debtType',
    'daxFileName',
    'daxImported',
    'settledValue',
    'phError',
    'daxError',
    'receivedInRequestEditor',
    'enriched',
    'ledgerSplit',
    'releasedFromRequestEditor',
    'daxPaymentRequestNumber',
    'daxValue',
    'overallStatus',
    'crossBorderFlag',
    'valueStillToProcess',
    'prStillToProcess'
  ]
}

const pickColumns = (record, table) => {
  return Object.fromEntries(
    Object.entries(record)
      .filter(([column]) => COLUMNS[table].includes(column))
  )
}

module.exports = {
  COLUMNS,
  pickColumns
}

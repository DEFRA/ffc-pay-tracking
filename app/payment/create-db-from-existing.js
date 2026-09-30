const { reportData } = require('../database')
const { pickReportDataColumns } = require('../helpers/pick-report-data-columns')

const createDBFromExisting = async (data, existingData, transaction) => {
  data.value = existingData.value
  data.batch = existingData.batch
  data.batchExportDate = existingData.batchExportDate
  data.originalInvoiceNumber = existingData.originalInvoiceNumber
  data.routedToRequestEditor = existingData.routedToRequestEditor
  data.receivedInRequestEditor = existingData.receivedInRequestEditor
  data.releasedFromRequestEditor = existingData.releasedFromRequestEditor
  data.deltaAmount = existingData.deltaAmount
  data.enriched = existingData.enriched
  data.ledgerSplit = 'Y'
  return reportData(transaction ?? undefined).insert(pickReportDataColumns(data))
}

module.exports = {
  createDBFromExisting
}

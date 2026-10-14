const { reportData } = require('../database')
const TABLES = require('../constants/tables')
const { pickColumns } = require('../constants/columns')

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
  return reportData(transaction ?? undefined).insert(pickColumns(data, TABLES.reportData))
}

module.exports = {
  createDBFromExisting
}

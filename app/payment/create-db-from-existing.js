const db = require('../data')

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
  return db.reportData.create({ ...data }, { transaction })
}

module.exports = {
  createDBFromExisting
}

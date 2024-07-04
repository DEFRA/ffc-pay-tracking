const db = require('../data')

const createDBFromExisting = async (data, existingData, transaction) => {
  data.value = existingData.value
  data.batch = existingData.batch
  data.batchExportDate = existingData.batchExportDate
  data.originalInvoiceNumber = existingData.originalInvoiceNumber
  data.routedToRequestEditor = existingData.routedToRequestEditor
  data.deltaAmount = existingData.deltaAmount
  data.ledgerSplit = 'Y'
  return db.reportData.create({ ...data }, { transaction })
}

module.exports = {
  createDBFromExisting
}

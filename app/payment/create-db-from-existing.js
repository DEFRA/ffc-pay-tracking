const db = require('../data')

const createDBFromExisting = async (data, existingData, transaction) => {
  data.value = existingData.value
  data.batchExportDate = existingData.batchExportDate
  data.originalInvoiceNumber = existingData.originalInvoiceNumber
  data.deltaAmount = existingData.deltaAmount
  return db.reportData.create({ ...data }, { transaction })
}

module.exports = {
  createDBFromExisting
}

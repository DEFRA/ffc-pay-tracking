const db = require('../data')

const updateExistingRecord = async (newData, invoiceNumber, transaction) => {
  const updateData = {
    status: newData.status,
    apValue: newData.apValue,
    arValue: newData.arValue,
    daxFileName: newData.daxFileName?.includes('_AP_') ? newData.daxFileName : null,
    daxImported: newData.daxImported,
    settledValue: newData.settledValue,
    ledgerSplit: 'Y',
    daxPaymentRequestNumber: newData.daxPaymentRequestNumber,
    daxValue: newData.daxValue,
    overallStatus: newData.overallStatus,
    valueStillToProcess: newData.valueStillToProcess,
    prStillToProcess: newData.prStillToProcess,
    lastUpdated: newData.lastUpdated
  }
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === null || updateData[key] === undefined) {
      delete updateData[key]
    }
  })
  await db.reportData.update(updateData, {
    where: {
      invoiceNumber
    },
    transaction
  })
}

module.exports = {
  updateExistingRecord
}

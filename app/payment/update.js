const db = require('../data')
const { createData } = require('./create-data')
const { getExistingDataFull } = require('../get-existing-data-full')
const { isNewInvoiceNumber } = require('./is-new-invoice-number')
const { createDBFromExisting } = require('./create-db-from-existing')
const { getWhereFilter } = require('../get-where-filter')
const { updateLedgerSplit } = require('./update-ledger-split')

const updatePayment = async (event) => {
  const transaction = await db.sequelize.transaction()
  try {
    const dbData = await createData(event, transaction)
    const existingData = await getExistingDataFull(event.data, transaction)
    if (existingData) {
      let reportDataCut
      if (isNewInvoiceNumber(event, existingData)) {
        reportDataCut = createDBFromExisting(dbData, existingData, transaction)
        const where = getWhereFilter(event)
        where.invoiceNumber = event.data.originalInvoiceNumber
        if (Object.values(where).every(value => value !== null && value !== undefined)) {
          await db.reportData.destroy({
            where,
            transaction
          })
        }
      } else {
        const where = getWhereFilter(event)
        if (Object.values(where).every(value => value !== null && value !== undefined)) {
          reportDataCut = await db.reportData.update({ ...dbData }, {
            where,
            transaction
          })
        }
      }
      if (reportDataCut) {
        await updateLedgerSplit(reportDataCut)
      }
      await transaction.commit()
    } else {
      await db.reportData.create({ ...dbData }, { transaction })
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = {
  updatePayment
}

const db = require('../data')
const { createData } = require('./create-data')
const { getExistingDataFull } = require('../helpers/get-existing-data-full')
const { isNewSplitInvoiceNumber } = require('./is-new-split-invoice-number')
const { createDBFromExisting } = require('./create-db-from-existing')
const { getWhereFilter } = require('../helpers/get-where-filter')
const { sendUpdateFailureEvent } = require('../event/send-update-failure')
const { TRACKING_UPDATE_FAILURE } = require('../constants/events')
const { updateExistingRecord } = require('./update-existing-record')
const { swapAbsoluteValue } = require('./swap-absolute-value')

const updatePayment = async (event) => {
  const transaction = await db.sequelize.transaction()

  try {
    const dbData = await createData(event, transaction)
    dbData.value = dbData.value * swapAbsoluteValue(event.data.schemeId)
    const existingData = await getExistingDataFull(event.data, transaction)
    if (existingData) {
      await handleExistingData(event, dbData, existingData, transaction)
    } else {
      await handleNewData(event, dbData, transaction)
    }

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    console.error('An error occurred while updating payment report records:', error)
    await sendUpdateFailureEvent(event?.type, TRACKING_UPDATE_FAILURE, error.message)
    throw error
  }
}

const handleExistingData = async (event, dbData, existingData, transaction) => {
  if (isNewSplitInvoiceNumber(event, existingData)) {
    await createDBFromExisting(dbData, existingData, transaction)
    const originalInvoiceNumber = dbData.invoiceNumber.replace('AV', 'V0').replace('BV', 'V0')
    await updateExistingRecord(dbData, originalInvoiceNumber, transaction)
  } else {
    await handleUpdateExistingData(event, dbData, transaction)
  }
}

const handleNewData = async (event, dbData, transaction) => {
  await db.reportData.create({ ...dbData }, { transaction })
}

const handleUpdateExistingData = async (event, dbData, transaction) => {
  const where = getWhereFilter(event)

  if (Object.values(where).every(value => value !== null && value !== undefined)) {
    await db.reportData.update({ ...dbData }, { where, transaction })
  }

  if (dbData.invoiceNumber?.includes('AV') || dbData.invoiceNumber?.includes('BV')) {
    const originalWhere = { ...where }
    originalWhere.invoiceNumber = dbData.invoiceNumber.replace('AV', 'V0').replace('BV', 'V0')
    const originalRecord = await db.reportData.findOne({ where: originalWhere, transaction })
    if (originalRecord) {
      await updateExistingRecord(dbData, originalWhere.invoiceNumber, transaction)
    }
  }
}

module.exports = {
  updatePayment
}

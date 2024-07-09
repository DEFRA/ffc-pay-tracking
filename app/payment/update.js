const db = require('../data')
const { createData } = require('./create-data')
const { getExistingDataFull } = require('../get-existing-data-full')
const { isNewSplitInvoiceNumber } = require('./is-new-split-invoice-number')
const { createDBFromExisting } = require('./create-db-from-existing')
const { getWhereFilter } = require('../get-where-filter')

const updatePayment = async (event) => {
  const transaction = await db.sequelize.transaction()

  try {
    const dbData = await createData(event, transaction)
    const existingData = await getExistingDataFull(event.data, transaction)

    if (existingData) {
      await handleExistingData(event, dbData, existingData, transaction)
    } else {
      await handleNewData(event, dbData, transaction)
    }

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

const handleExistingData = async (event, dbData, existingData, transaction) => {
  if (isNewSplitInvoiceNumber(event, existingData)) {
    await handleSplitInvoiceNumber(event, dbData, existingData, transaction)
  } else {
    await handleUpdateExistingData(event, dbData, transaction)
  }
}

const handleNewData = async (event, dbData, transaction) => {
  await db.reportData.create({ ...dbData }, { transaction })
}

const handleSplitInvoiceNumber = async (event, dbData, existingData, transaction) => {
  const where = getWhereFilter(event)
  delete where.invoiceNumber

  if (Object.values(where).every(value => value !== null && value !== undefined)) {
    const splitEntries = await db.reportData.findAll({ where, transaction })

    if (splitEntries.length > 2 && event.data.originalInvoiceNumber) {
      where.invoiceNumber = event.data.originalInvoiceNumber
      await db.reportData.destroy({ where, transaction })
    }
  }

  await createDBFromExisting(dbData, existingData, transaction)
}

const handleUpdateExistingData = async (event, dbData, transaction) => {
  const where = getWhereFilter(event)

  if (Object.values(where).every(value => value !== null && value !== undefined)) {
    await db.reportData.update({ ...dbData }, { where, transaction })
  }
}

module.exports = {
  updatePayment
}

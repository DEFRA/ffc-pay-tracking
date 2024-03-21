const db = require('../data')
const { createData } = require('./create-data')
const { getExistingDataFull } = require('../get-existing-data-full')
const { isNewInvoiceNumber } = require('./is-new-invoice-number')
const { createDBFromExisting } = require('./create-db-from-existing')
const { getWhereFilter } = require('../get-where-filter')

const updatePayment = async (event) => {
  const transaction = await db.sequelize.transaction()
  try {
    const dbData = await createData(event, transaction)
    const existingData = await getExistingDataFull(event.data.correlationId, event.data.sourceSystem, event.data.frn, event.data.agreementNumber, transaction)
    if (existingData) {
      if (isNewInvoiceNumber(event, existingData)) {
        createDBFromExisting(dbData, existingData, transaction)
        await db.reportData.destroy({
          where: {
            correlationId: event.data.correlationId,
            sourceSystem: event.data.sourceSystem,
            frn: event.data.frn,
            agreementNumber: event.data.agreementNumber,
            invoiceNumber: event.data.originalInvoiceNumber
          },
          transaction
        })
      } else {
        const where = getWhereFilter(event)
        await db.reportData.update({ ...dbData }, {
          where,
          transaction
        })
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

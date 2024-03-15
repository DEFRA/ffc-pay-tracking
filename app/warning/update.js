const db = require('../data')
const { createData } = require('./create-data')
const { getExistingDataFull } = require('../get-existing-data-full')

const updateWarning = async (event) => {
  const transaction = await db.sequelize.transaction()
  const dbData = await createData(event)
  try {
    const existingData = await getExistingDataFull(event.data.correlationId, event.data.sourceSystem, event.data.frn, event.data.agreementNumber, transaction)
    if (existingData) {
      await db.reportData.update({ ...dbData }, {
        where: {
          correlationId: event.data.correlationId,
          invoiceNumber: event.data.invoiceNumber
        }
      })
    } else {
      await db.reportData.create({ ...dbData }, { transaction })
    }
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = {
  updateWarning
}

const db = require('../data')
const { getExistingReturnMessage } = require('./get-existing-return-message')
const { getSchemeId } = require('../tracking/get-scheme-id')

const saveReturnMessage = async (returnMessage) => {
  const transaction = await db.sequelize.transaction()
  try {
    const existingReturnMessage = await getExistingReturnMessage(returnMessage.referenceId, transaction)
    if (existingReturnMessage) {
      console.info(`Duplicate return message received, skipping ${existingReturnMessage.referenceId}`)
      await transaction.rollback()
    } else {
      const scheme = getSchemeId(returnMessage.sourceSystem, returnMessage.invoiceNumber)
      await db.return.create({ ...returnMessage, schemeId: scheme }, { transaction })
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = {
  saveReturnMessage
}

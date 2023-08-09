// const { v4: uuidv4 } = require('uuid')
const db = require('../data')
const { getSchemeId } = require('../tracking/get-scheme-id')
// const { getExistingPaymentRequest } = require('./get-existing-payment-request')

const saveReturnMessage = async (returnMessage) => {
  const transaction = await db.sequelize.transaction()
  try {
    // const existingPaymentRequest = await getExistingPaymentRequest(paymentRequest.invoiceNumber, transaction)
    // if (existingPaymentRequest) {
    // console.info(`Duplicate payment request received, skipping ${existingPaymentRequest.invoiceNumber}`)
    // await transaction.rollback()
    // } else {
    const scheme = getSchemeId(returnMessage.sourceSystem)
    await db.returns.create({ ...returnMessage, schemeId: scheme }, { transaction })
    await transaction.commit()
    // }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = {
  saveReturnMessage
}

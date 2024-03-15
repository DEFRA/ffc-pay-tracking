const db = require('../data')
const { getValue } = require('./get-value')

const getDeltaAmount = async (event, transaction) => {
  const requestNumber = event.data.paymentRequestNumber
  const value = getValue(event)
  if (requestNumber === 1 || value === null) {
    return value
  }
  const previousRequest = await db.reportData.findOne({
    where: {
      paymentRequestNumber: requestNumber - 1,
      sourceSystem: event.data.sourceSystem,
      frn: event.data.frn,
      agreementNumber: event.data.agreementNumber
    },
    transaction
  })
  return value - previousRequest?.value
}

module.exports = {
  getDeltaAmount
}

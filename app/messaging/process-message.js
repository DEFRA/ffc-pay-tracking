const { PAYMENT_EVENT_PREFIX, WARNING_EVENT_PREFIX } = require('../constants/event-prefixes')
const { updatePayment } = require('../payment')
const { updateWarning } = require('../warning')

const processMessage = async (message, receiver) => {
  console.log('Event received: ', message.body)
  if (message.body.type.includes(PAYMENT_EVENT_PREFIX)) {
    await updatePayment(message.body)
    console.log(`Event processed: ${message.body.type} for FRN ${message.body.data.frn}, agreement number ${message.body.data.agreementNumber}`)
  }
  // if (message.body.type.includes(WARNING_EVENT_PREFIX)) {
  //   updateWarning(message.body)
  // }
  await receiver.completeMessage(message)
}

module.exports = {
  processMessage
}

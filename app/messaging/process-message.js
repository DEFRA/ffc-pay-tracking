const { PAYMENT_EVENT_PREFIX, WARNING_EVENT_PREFIX } = require('../constants/event-prefixes')
const { updatePayment } = require('../payment')
const { updateWarning } = require('../warning')

const processMessage = async (message, receiver) => {
  console.log('Event received: ', message.body)
  try {
    if (message.body.type.includes(PAYMENT_EVENT_PREFIX)) {
      await updatePayment(message.body)
      console.log(`Event processed: ${message.body.type} for FRN ${message.body.data.frn}, agreement number ${message.body.data.agreementNumber}`)
    }
    if (message.body.type.includes(WARNING_EVENT_PREFIX)) {
      await updateWarning(message.body)
      console.log(`Warning processed: ${message.body.type} for subject ${message.body.subject}`)
    }
    await receiver.completeMessage(message)
  } catch (error) {
    console.error('Error processing message: ', error)
    receiver.deadLetterMessage(message)
  }
}

module.exports = {
  processMessage
}

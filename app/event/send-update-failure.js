const messageConfig = require('../config/message')
const { EventPublisher } = require('ffc-pay-event-publisher')

const sendUpdateFailureEvent = async (subject, type, error) => {
  const event = {
    source: 'ffc-pay-tracking',
    type,
    subject,
    data: {
      message: error
    }
  }
  const eventPublisher = new EventPublisher(messageConfig.eventsTopic)
  await eventPublisher.publishEvent(event)
}

module.exports = {
  sendUpdateFailureEvent
}

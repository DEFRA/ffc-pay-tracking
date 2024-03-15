const { messageConfig } = require('../config')
const { MessageReceiver } = require('ffc-messaging')
const { processMessage } = require('./process-message')
const paymentReceivers = []
let eventsReceiver

const start = async () => {
  const processingAction = message => processMessage(message, eventsReceiver)
  eventsReceiver = new MessageReceiver(messageConfig.eventsSubscription, processingAction)
  await eventsReceiver.subscribe()
}

const stop = async () => {
  for (const paymentReceiver of paymentReceivers) {
    await paymentReceiver.closeConnection()
  }
}

module.exports = { start, stop }

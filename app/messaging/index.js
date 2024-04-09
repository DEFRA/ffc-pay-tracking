const { messageConfig } = require('../config')
const { MessageReceiver } = require('ffc-messaging')
const { processMessage } = require('./process-message')
let eventsReceiver

const start = async () => {
  const processingAction = message => processMessage(message, eventsReceiver)
  eventsReceiver = new MessageReceiver(messageConfig.eventsSubscription, processingAction)
  await eventsReceiver.subscribe()
}

const stop = async () => {
  await eventsReceiver.closeConnection()
}

module.exports = { start, stop }

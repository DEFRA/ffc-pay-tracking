const { messageConfig } = require('../config')
const { MessageReceiver } = require('ffc-messaging')
const { processEventMessage } = require('./process-event-message')
const { processRetentionMessage } = require('./process-retention-message')

let eventsReceiver
let retentionReceiver

const start = async () => {
  const processingAction = message => processEventMessage(message, eventsReceiver)
  eventsReceiver = new MessageReceiver(messageConfig.eventsSubscription, processingAction)
  await eventsReceiver.subscribe()

  const retentionAction = message => processRetentionMessage(message, retentionReceiver)
  retentionReceiver = new MessageReceiver(messageConfig.retentionSubscription, retentionAction)
  await retentionReceiver.subscribe()

  console.log('Ready to receive messages')
}

const stop = async () => {
  await eventsReceiver.closeConnection()
  await retentionReceiver.closeConnection()
}

module.exports = { start, stop }

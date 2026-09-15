const { messageConfig } = require('../config')
const { createServiceBusClient, createReceiver, subscribeReceiver, closeSenders } = require('./service-bus')
const { processEventMessage } = require('./process-event-message')
const { processRetentionMessage } = require('./process-retention-message')

let sbClient
let eventsReceiver
let retentionReceiver

const handleError = (error) => {
  console.error('Error receiving message:', error)
}

const start = async () => {
  sbClient = createServiceBusClient(messageConfig.eventsSubscription)
  const processingAction = message => processEventMessage(message, eventsReceiver)
  eventsReceiver = createReceiver(sbClient, messageConfig.eventsSubscription)
  subscribeReceiver(eventsReceiver, processingAction, handleError, messageConfig.eventsSubscription)

  const retentionAction = message => processRetentionMessage(message, retentionReceiver)
  retentionReceiver = createReceiver(sbClient, messageConfig.retentionSubscription)
  subscribeReceiver(retentionReceiver, retentionAction, handleError, messageConfig.retentionSubscription)

  console.log('Ready to receive messages')
}

const stop = async () => {
  if (sbClient) {
    try {
      await sbClient.close()
    } catch (err) {
      console.error('Error closing Service Bus client:', err)
    }
  }
  await closeSenders(eventsReceiver)
  await closeSenders(retentionReceiver)
}

module.exports = { start, stop }

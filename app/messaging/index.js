const { messageConfig } = require('../config')
const { MessageReceiver } = require('ffc-messaging')
const { processPaymentMessage } = require('./process-payment-message')
const { processRequestResponseMessage } = require('./process-request-response-message')
const { processProcessingMessage } = require('./process-processing-message')
const { processSubmitMessage } = require('./process-submit-message')
const { processReturnMessage } = require('./process-return-message')
const { processAcknowledgementMessage } = require('./process-acknowledgement-message')
const paymentReceivers = []
let requestResponseReceiver
let processingReceiver
let submitReceiver
let returnReceiver
let acknowledgementReceiver

const start = async () => {
  for (let i = 0; i < messageConfig.processingSubscription.numberOfReceivers; i++) {
    let paymentReceiver  // eslint-disable-line
    const paymentAction = message => processPaymentMessage(message, paymentReceiver)
    paymentReceiver = new MessageReceiver(messageConfig.processingSubscription, paymentAction)
    paymentReceivers.push(paymentReceiver)
    await paymentReceiver.subscribe()
    console.info(`Receiver ${i + 1} ready to receive payment requests`)
  }

  const requestResponseAction = message => processRequestResponseMessage(message, requestResponseReceiver)
  requestResponseReceiver = new MessageReceiver(messageConfig.requestResponseSubscription, requestResponseAction)
  await requestResponseReceiver.subscribe()

  const processingAction = message => processProcessingMessage(message, processingReceiver)
  processingReceiver = new MessageReceiver(messageConfig.processingSubscription, processingAction)
  await processingReceiver.subscribe()
  
  const submitAction = message => processSubmitMessage(message, submitReceiver)
  submitReceiver = new MessageReceiver(messageConfig.submitSubscription, submitAction)
  await submitReceiver.subscribe()

  const returnAction = message => processReturnMessage(message, returnReceiver)
  returnReceiver = new MessageReceiver(messageConfig.returnSubscription, returnAction)
  await returnReceiver.subscribe()

  const acknowledgementAction = message => processAcknowledgementMessage(message, acknowledgementReceiver)
  acknowledgementReceiver = new MessageReceiver(messageConfig.acknowledgementSubscription, acknowledgementAction)
  await acknowledgementReceiver.subscribe()
}

const stop = async () => {
  for (const paymentReceiver of paymentReceivers) {
    await paymentReceiver.closeConnection()
  }
}

module.exports = { start, stop }

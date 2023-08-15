const Joi = require('joi')
const { PRODUCTION } = require('../constants/environments')

const schema = Joi.object({
  messageQueue: {
    host: Joi.string().required(),
    username: Joi.string(),
    password: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    appInsights: Joi.object()
  },
  requestResponseSubscription: {
    address: Joi.string().required(),
    topic: Joi.string().required(),
    type: Joi.string().default('subscription')
  },
  processingSubscription: {
    address: Joi.string().required(),
    topic: Joi.string().required(),
    type: Joi.string().default('subscription')
  },
  submitSubscription: {
    address: Joi.string().required(),
    topic: Joi.string().required(),
    type: Joi.string().default('subscription')
  },
  returnSubscription: {
    address: Joi.string().required(),
    topic: Joi.string().required(),
    type: Joi.string().default('subscription')
  },
  acknowledgementSubscription: {
    address: Joi.string().required(),
    topic: Joi.string().required(),
    type: Joi.string().default('subscription')
  }
})

const config = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    useCredentialChain: process.env.NODE_ENV === PRODUCTION,
    appInsights: process.env.NODE_ENV === PRODUCTION ? require('applicationinsights') : undefined
  },
  requestResponseSubscription: {
    address: process.env.REQUEST_RESPONSE_SUBSCRIPTION_ADDRESS,
    topic: process.env.REQUEST_RESPONSE_TOPIC_ADDRESS
  },
  processingSubscription: {
    address: process.env.PROCESSING_SUBSCRIPTION_ADDRESS,
    topic: process.env.PROCESSING_TOPIC_ADDRESS
  },
  submitSubscription: {
    address: process.env.SUBMIT_SUBSCRIPTION_ADDRESS,
    topic: process.env.SUBMIT_TOPIC_ADDRESS
  },
  returnSubscription: {
    address: process.env.RETURN_SUBSCRIPTION_ADDRESS,
    topic: process.env.RETURN_TOPIC_ADDRESS
  },
  acknowledgementSubscription: {
    address: process.env.ACKNOWLEDGEMENT_SUBSCRIPTION_ADDRESS,
    topic: process.env.ACKNOWLEDGEMENT_TOPIC_ADDRESS
  }
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The message queue config is invalid. ${result.error.message}`)
}

const requestResponseSubscription = { ...result.value.messageQueue, ...result.value.requestResponseSubscription }
const processingSubscription = { ...result.value.messageQueue, ...result.value.processingSubscription }
const submitSubscription = { ...result.value.messageQueue, ...result.value.submitSubscription }
const returnSubscription = { ...result.value.messageQueue, ...result.value.returnSubscription }
const acknowledgementSubscription = { ...result.value.messageQueue, ...result.value.acknowledgementSubscription }

module.exports = {
  requestResponseSubscription,
  processingSubscription,
  submitSubscription,
  returnSubscription,
  acknowledgementSubscription
}

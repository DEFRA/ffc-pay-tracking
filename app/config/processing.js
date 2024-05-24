const Joi = require('joi')

const schema = Joi.object({
  legacyProcessingInterval: Joi.number().default(6000),
  processingCap: Joi.number().default(500),
  paymentsEndpoint: Joi.string().uri().required()
})

const config = {
  legacyProcessingInterval: process.env.PROCESSING_INTERVAL,
  processingCap: process.env.PROCESSING_CAP,
  paymentsEndpoint: process.env.PAYMENTS_SERVICE_ENDPOINT
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The processing config is invalid. ${result.error.message}`)
}

const value = result.value

module.exports = value

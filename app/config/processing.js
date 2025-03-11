const Joi = require('joi')

const schema = Joi.object({
  active: Joi.boolean().default(true),
  legacyProcessingInterval: Joi.number().default(60000),
  processingCap: Joi.number().default(2500),
  paymentsEndpoint: Joi.string().uri().required()
})

const config = {
  active: process.env.PROCESSING_ACTIVE,
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

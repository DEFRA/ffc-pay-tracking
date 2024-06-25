const Joi = require('joi')

const schema = Joi.object({
  legacyProcessingInterval: Joi.number().default(60000),
  processingCap: Joi.number().default(500),
  paymentsEndpoint: Joi.string().uri().required(),
  legacyProcessingActive: Joi.boolean().required().default(true)
})

const config = {
  legacyProcessingInterval: process.env.PROCESSING_INTERVAL,
  processingCap: process.env.PROCESSING_CAP,
  paymentsEndpoint: process.env.PAYMENTS_SERVICE_ENDPOINT,
  legacyProcessingActive: process.env.LEGACY_PROCESSING_ACTIVE
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The processing config is invalid. ${result.error.message}`)
}

const value = result.value

module.exports = value

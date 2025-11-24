const Joi = require('joi')

const schema = Joi.object({
  processingActive: Joi.boolean().default(true),
  processingCap: Joi.number().default(2500),
  paymentsEndpoint: Joi.string().uri().required(),
  legacyProcessingActive: Joi.boolean().default(false),
  legacyProcessingInterval: Joi.number().default(60000)
})

const config = {
  processingActive: process.env.PROCESSING_ACTIVE,
  processingCap: process.env.PROCESSING_CAP,
  paymentsEndpoint: process.env.PAYMENTS_SERVICE_ENDPOINT,
  legacyProcessingActive: process.env.LEGACY_PROCESSING_ACTIVE,
  legacyProcessingInterval: process.env.LEGACY_PROCESSING_INTERVAL
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The processing config is invalid. ${result.error.message}`)
}

const value = result.value

module.exports = value

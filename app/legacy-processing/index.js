const { processingConfig } = require('../config')
const { processLegacyPayments } = require('./process-legacy-payments')

const start = async () => {
  try {
    if (processingConfig.legacyProcessingActive) {
      await processLegacyPayments()
    }
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, processingConfig.legacyProcessingInterval)
  }
}

module.exports = {
  start
}

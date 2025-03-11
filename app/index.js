require('log-timestamp')
const { processingConfig } = require('./config')
const server = require('./server/server')
const messaging = require('./messaging')
const legacyProcessing = require('./legacy-processing')

const startApp = async () => {
  await server.start()
  if (processingConfig.processingActive) {
    await messaging.start()
    await legacyProcessing.start()
  } else {
    console.info('Processing capabilities are currently not enabled in this environment')
  }
}

(async () => {
  await startApp()
})()

module.exports = startApp

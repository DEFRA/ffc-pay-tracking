require('log-timestamp')
const { processingConfig } = require('./config')
const server = require('./server/server')
const messaging = require('./messaging')

process.on(['SIGTERM', 'SIGINT'], async () => {
  await messaging.stop()
  process.exit(0)
})

const startApp = async () => {
  await server.start()
  if (processingConfig.processingActive) {
    await messaging.start()
  } else {
    console.info('Processing capabilities are currently not enabled in this environment')
  }
}

(async () => {
  await startApp()
})()

module.exports = startApp

require('log-timestamp')
const server = require('./server/server')
const messaging = require('./messaging')
const legacyProcessing = require('./legacy-processing')

const init = async () => {
  await server.start()
  await messaging.start()
  await legacyProcessing.start()
}

process.on(['SIGTERM', 'SIGINT'], async () => {
  await messaging.stop()
  process.exit(0)
})

init()

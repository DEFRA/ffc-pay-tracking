const server = require('./server/server')
const messaging = require('./messaging')

const init = async () => {
  await server.start()

  await messaging.start()
}

process.on(['SIGTERM', 'SIGINT'], async () => {
  await messaging.stop()
  process.exit(0)
})

init()

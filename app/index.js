const server = require('./server')
const messaging = require('./messaging')

const init = async () => {
  await server.start()
  console.log('Server running on %s', server.info.uri)

  await messaging.start()
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()

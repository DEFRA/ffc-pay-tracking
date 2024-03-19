const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/report-data')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server) => {
      server.route(routes)
    }
  }
}

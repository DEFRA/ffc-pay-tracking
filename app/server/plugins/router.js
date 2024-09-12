const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/report-data'),
  require('../routes/ap-report-data'),
  require('../routes/ar-report-data'),
  require('../routes/request-editor-report-data'),
  require('../routes/claim-level-report'),
  require('../routes/transaction-summary')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server) => {
      server.route(routes)
    }
  }
}

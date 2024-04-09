const router = require('../../../../../app/server/plugins/router')
const healthyRoute = require('../../../../../app/server/routes/healthy')
const healthzRoute = require('../../../../../app/server/routes/healthz')
const reportDataRoute = require('../../../../../app/server/routes/report-data')

jest.mock('../../../../../app/server/routes/healthy')
jest.mock('../../../../../app/server/routes/healthz')
jest.mock('../../../../../app/server/routes/report-data')

test('router plugin registers routes', () => {
  const mockServer = {
    route: jest.fn()
  }

  router.plugin.register(mockServer)

  expect(mockServer.route).toHaveBeenCalledWith(
    expect.arrayContaining([
      healthyRoute,
      healthzRoute,
      ...reportDataRoute
    ])
  )
})

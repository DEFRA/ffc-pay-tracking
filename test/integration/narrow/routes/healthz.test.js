const Hapi = require('@hapi/hapi')
const healthz = require('../../../../app/server/routes/healthz')

describe('GET /healthz', () => {
  let server

  beforeEach(async () => {
    server = Hapi.server()
    server.route(healthz)
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('responds with 200 and ok', async () => {
    const options = {
      method: 'GET',
      url: '/healthz'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toBe('ok')
  })
})

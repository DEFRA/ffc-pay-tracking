const Hapi = require('@hapi/hapi')
const healthy = require('../../../../app/server/routes/healthy')

describe('GET /healthy', () => {
  let server

  beforeEach(async () => {
    server = Hapi.server()
    server.route(healthy)
    await server.initialize()
  })
  afterEach(async () => {
    await server.stop()
  })

  test('responds with 200 and ok', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toBe('ok')
  })
})

const hapi = require('@hapi/hapi')
const { createServer } = require('../../../../app/server/create-server')
const { serverConfig } = require('../../../../app/config')

jest.mock('@hapi/hapi', () => ({
  server: jest.fn().mockImplementation(() => ({
    register: jest.fn()
  }))
}))

jest.mock('../../../../app/config', () => ({
  serverConfig: {
    port: 1234,
    isDev: false
  }
}))

jest.mock('../../../../app/data', () => ({
  Sequelize: jest.fn().mockImplementation(() => ({
    define: jest.fn(),
    authenticate: jest.fn()
  })),
  databaseConfig: {
    database: 'testDatabase',
    username: 'testUsername',
    password: 'testPassword',
    host: 'testHost',
    dialect: 'testDialect'
  }
}))

test('createServer returns a server', async () => {
  const mockServer = await createServer()

  expect(hapi.server).toHaveBeenCalledWith({
    port: serverConfig.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  expect(mockServer.register).toHaveBeenCalledTimes(3)
})

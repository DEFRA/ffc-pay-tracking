const logging = require('../../../../../app/server/plugins/logging')
const hapiPino = require('hapi-pino')

jest.mock('hapi-pino')

test('logging plugin has correct structure and values', () => {
  expect(logging).toEqual({
    plugin: hapiPino,
    options: {
      logPayload: true,
      level: 'warn'
    }
  })
})

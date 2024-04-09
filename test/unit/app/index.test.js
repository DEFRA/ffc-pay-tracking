const server = require('../../../app/server/server')
const messaging = require('../../../app/messaging/index')

jest.mock('../../../app/server/server', () => ({
  start: jest.fn()
}))

jest.mock('../../../app/messaging/index', () => ({
  start: jest.fn(),
  stop: jest.fn()
}))

describe('index', () => {
  beforeEach(() => {
    jest.isolateModules(() => {
      require('../../../app/index')
    })
  })

  test('starts the server and messaging on initialization', () => {
    expect(server.start).toHaveBeenCalled()
    expect(messaging.start).toHaveBeenCalled()
  })
})

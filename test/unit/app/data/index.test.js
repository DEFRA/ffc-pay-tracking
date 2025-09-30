const path = require('path')

jest.resetModules()

describe('db module', () => {
  let mockConnectReturn
  let MockDatabase

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    mockConnectReturn = { query: jest.fn(), getRepository: jest.fn() }

    MockDatabase = jest.fn(function (opts) {
      this._opts = opts
      this.connect = jest.fn().mockReturnValue(mockConnectReturn)
    })

    jest.doMock('ffc-database', () => ({ Database: MockDatabase }))

    jest.doMock('../../../../app/config', () => ({ databaseConfig: { host: 'localhost', port: 1234 } }), { virtual: false })
  })

  afterEach(() => {
    jest.dontMock('ffc-database')
    jest.dontMock('../../../../app/config')
  })

  test('constructs Database with dbConfig merged with modelPath and calls connect', () => {
    const db = require('../../../../app/data/index')

    expect(MockDatabase).toHaveBeenCalledTimes(1)

    const constructedOpts = MockDatabase.mock.calls[0][0]
    expect(typeof constructedOpts).toBe('object')

    const moduleDir = path.dirname(require.resolve('../../../../app/data/index'))
    const expectedModelPath = path.join(moduleDir, 'models')
    expect(constructedOpts.modelPath).toBe(expectedModelPath)

    const instance = MockDatabase.mock.instances[0]
    expect(instance.connect).toHaveBeenCalledTimes(1)

    expect(db).toBe(mockConnectReturn)
  })

  test('forwards databaseConfig properties into Database constructor', () => {
    require('../../../../app/data/index')

    const constructedOpts = MockDatabase.mock.calls[0][0]

    expect(constructedOpts.host).toBe('localhost')
    expect(constructedOpts.port).toBe(1234)

    expect(typeof constructedOpts.modelPath).toBe('string')
  })
})

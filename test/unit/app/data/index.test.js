const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

jest.mock('fs', () => ({
  readdirSync: jest.fn(() => ['reportData.js'])
}))

jest.mock('sequelize', () => {
  const mSequelize = {
    define: jest.fn((modelName, modelDef) => ({
      name: modelName,
      associate: modelDef.associate
    })),
    authenticate: jest.fn()
  }

  const actualSequelize = jest.requireActual('sequelize')
  actualSequelize.Sequelize = jest.fn(() => mSequelize)
  return actualSequelize
})

jest.mock('@azure/identity', () => ({
  DefaultAzureCredential: jest.fn()
}))

describe('Database', () => {
  let db

  beforeEach(() => {
    db = require('../../../../app/data/index')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should initialize models', () => {
    const modelPath = path.resolve(__dirname, '../../../../app/data/models')

    expect(fs.readdirSync).toBeCalledWith(modelPath)
    expect(Sequelize.Sequelize).toHaveBeenCalledTimes(1)
  })

  jest.mock('../../../../app/data/models/reportData.js', () => {
    return () => ({
      name: 'reportData',
      associate: jest.fn()
    })
  })

  test('should call associate if it is defined in the model', () => {
    fs.readdirSync.mockReturnValue(['reportData.js'])
    const model = require('../../../../app/data/models/reportData.js')()
    db[model.name] = model
    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db)
      }
    })

    expect(model.associate).toHaveBeenCalledTimes(1)
  })
})

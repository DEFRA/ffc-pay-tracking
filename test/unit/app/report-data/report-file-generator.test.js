const { PassThrough } = require('stream')
const QueryStream = require('pg-query-stream')
const db = require('../../../../app/data')
const storage = require('../../../../app/storage')
const { generateSqlQuery, exportQueryToJsonFile } = require('../../../../app/report-data/report-file-generator')

jest.mock('pg-query-stream')
jest.mock('../../../../app/data', () => ({
  sequelize: {
    connectionManager: {
      getConnection: jest.fn(),
      releaseConnection: jest.fn()
    },
    getQueryInterface: () => ({
      queryGenerator: {
        getWhereConditions: jest.fn()
      }
    })
  },
  reportData: {
    getTableName: () => 'mock_table'
  }
}))

jest.mock('../../../../app/storage')

describe('report-file-generator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateSqlQuery', () => {
    beforeEach(() => {
      db.sequelize.getQueryInterface = () => ({
        queryGenerator: {
          getWhereConditions: jest.fn(() => 'id = 1')
        }
      })
    })

    test('returns base query when whereClause is null', () => {
      const result = generateSqlQuery(null)
      expect(result).toBe('SELECT * FROM mock_table')
    })

    test('returns query with WHERE clause', () => {
      const result = generateSqlQuery({ id: 1 })
      expect(result).toBe('SELECT * FROM mock_table WHERE id = 1')
    })
  })

  describe('exportQueryToJsonFile', () => {
    let pgStream
    let mockClient

    beforeEach(() => {
      pgStream = new PassThrough({ objectMode: true })

      mockClient = {
        query: jest.fn(() => pgStream)
      }

      db.sequelize.connectionManager.getConnection = jest.fn(() => Promise.resolve(mockClient))
      db.sequelize.connectionManager.releaseConnection = jest.fn(() => Promise.resolve())

      // Properly drain the stream in the mock
      storage.saveReportFile.mockImplementation((_filename, stream) => {
        stream.on('data', () => {}) // consume
        return new Promise((resolve) => {
          stream.on('end', resolve)
          stream.on('error', resolve)
        })
      })
    })

    test('exports query results to storage as JSON array', async () => {
      const exportPromise = exportQueryToJsonFile('SELECT * FROM mock_table', 'test-report', 100)

      // Emit data AFTER listeners are set up
      process.nextTick(() => {
        pgStream.emit('data', { id: 1, name: 'Alice' })
        pgStream.emit('data', { id: 2, name: 'Bob' })
        pgStream.emit('end')
      })

      const filename = await exportPromise

      expect(filename).toMatch(/^test-report-\d{4}-\d{2}-\d{2}T/)
      expect(mockClient.query).toHaveBeenCalledWith(expect.any(QueryStream))
      expect(storage.saveReportFile).toHaveBeenCalled()
      expect(db.sequelize.connectionManager.getConnection).toHaveBeenCalled()
      expect(db.sequelize.connectionManager.releaseConnection).toHaveBeenCalled()
    })

    test('throws error if storage.saveReportFile rejects', async () => {
      const error = new Error('Upload failed')
      storage.saveReportFile.mockImplementation(() => Promise.reject(error))

      process.nextTick(() => {
        pgStream.emit('data', { id: 1 })
        pgStream.emit('end')
      })

      await expect(exportQueryToJsonFile('SELECT * FROM mock_table', 'fail-report', 100)).rejects.toThrow('Upload failed')
      expect(db.sequelize.connectionManager.releaseConnection).toHaveBeenCalled()
    })
  })
})

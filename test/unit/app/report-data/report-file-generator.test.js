const { PassThrough } = require('stream')
const QueryStream = require('pg-query-stream')
const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['reportData'])
mockDb.knex.client = {
  acquireConnection: jest.fn(),
  releaseConnection: jest.fn()
}

const storage = require('../../../../app/storage')
const { generateSqlQuery, exportQueryToJsonFile } = require('../../../../app/report-data/report-file-generator')

jest.mock('pg-query-stream')
jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

jest.mock('../../../../app/storage')

describe('report-file-generator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateSqlQuery', () => {
    beforeEach(() => {
      mockDb.builder.toQuery = jest.fn(() => 'select * from "reportData"')
    })

    test('returns the bare query when no filter is supplied', () => {
      const result = generateSqlQuery()

      expect(mockDb.tables.reportData).toHaveBeenCalledWith()
      expect(result).toBe('select * from "reportData"')
    })

    test('applies the filter to the query builder', () => {
      const applyFilter = jest.fn((query) => query.where('id', 1))

      const result = generateSqlQuery(applyFilter)

      expect(applyFilter).toHaveBeenCalledWith(mockDb.builder)
      expect(mockDb.builder.where).toHaveBeenCalledWith('id', 1)
      expect(result).toBe('select * from "reportData"')
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

      mockDb.knex.client.acquireConnection.mockResolvedValue(mockClient)
      mockDb.knex.client.releaseConnection.mockResolvedValue()

      storage.saveReportFile.mockImplementation((_filename, stream) => {
        stream.on('data', () => {})
        return new Promise((resolve) => {
          stream.on('end', resolve)
          stream.on('error', resolve)
        })
      })
    })

    test('exports query results to storage as JSON array', async () => {
      const exportPromise = exportQueryToJsonFile('SELECT * FROM mock_table', 'test-report', 100)

      process.nextTick(() => {
        pgStream.emit('data', { id: 1, name: 'Alice' })
        pgStream.emit('data', { id: 2, name: 'Bob' })
        pgStream.emit('end')
      })

      const filename = await exportPromise

      expect(filename).toMatch(/^test-report-\d{4}-\d{2}-\d{2}T/)
      expect(mockClient.query).toHaveBeenCalledWith(expect.any(QueryStream))
      expect(storage.saveReportFile).toHaveBeenCalled()
      expect(mockDb.knex.client.acquireConnection).toHaveBeenCalled()
      expect(mockDb.knex.client.releaseConnection).toHaveBeenCalled()
    })

    test('throws error if storage.saveReportFile rejects', async () => {
      const error = new Error('Upload failed')
      storage.saveReportFile.mockImplementation(() => Promise.reject(error))

      process.nextTick(() => {
        pgStream.emit('data', { id: 1 })
        pgStream.emit('end')
      })

      await expect(exportQueryToJsonFile('SELECT * FROM mock_table', 'fail-report', 100)).rejects.toThrow('Upload failed')
      expect(mockDb.knex.client.releaseConnection).toHaveBeenCalled()
    })
  })
})

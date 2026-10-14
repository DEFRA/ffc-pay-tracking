const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock()
jest.mock('../../../../app/report-data/report-file-generator.js', () => ({
  generateSqlQuery: jest.fn(),
  exportQueryToJsonFile: jest.fn()
}))

const { getAPARReportData } = require('../../../../app/report-data/get-AP-AR-report-data')
const { generateSqlQuery, exportQueryToJsonFile } = require('../../../../app/report-data/report-file-generator.js')
const { AP, AR } = require('../../../../app/constants/ledgers')

describe('getAPARReportData', () => {
  const buildFilter = () => {
    const applyFilter = generateSqlQuery.mock.calls[0][0]
    applyFilter(mockDb.builder)
    return mockDb.builder
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should generate SQL and export AP data when start and end dates are provided', async () => {
    const mockSql = 'SELECT * FROM reportData WHERE ...'
    const mockData = [{ apValue: 1 }, { apValue: 2 }]
    generateSqlQuery.mockReturnValue(mockSql)
    exportQueryToJsonFile.mockResolvedValue(mockData)

    const startDate = '2022-01-01'
    const endDate = '2022-12-31'
    const result = await getAPARReportData(startDate, endDate, AP)

    const builder = buildFilter()
    expect(builder.whereNotNull).toHaveBeenCalledWith('apValue')
    expect(builder.whereNotNull).toHaveBeenCalledWith('daxFileName')
    expect(builder.whereBetween).toHaveBeenCalledWith('lastUpdated', [startDate, endDate])
    expect(exportQueryToJsonFile).toHaveBeenCalledWith(mockSql)
    expect(result).toEqual(mockData)
  })

  test('should generate SQL and export AR data when start and end dates are provided', async () => {
    const mockSql = 'SELECT * FROM reportData WHERE ...'
    const mockData = [{ arValue: 1 }, { arValue: 2 }]
    generateSqlQuery.mockReturnValue(mockSql)
    exportQueryToJsonFile.mockResolvedValue(mockData)

    const startDate = '2022-01-01'
    const endDate = '2022-12-31'
    const result = await getAPARReportData(startDate, endDate, AR)

    const builder = buildFilter()
    expect(builder.whereNotNull).toHaveBeenCalledWith('arValue')
    expect(builder.whereNotNull).toHaveBeenCalledWith('daxFileName')
    expect(builder.whereBetween).toHaveBeenCalledWith('lastUpdated', [startDate, endDate])
    expect(exportQueryToJsonFile).toHaveBeenCalledWith(mockSql)
    expect(result).toEqual(mockData)
  })

  test('should generate SQL without date filtering when dates are not provided', async () => {
    const mockSql = 'SELECT * FROM reportData WHERE ...'
    const mockData = [{ apValue: 1 }, { apValue: 2 }]
    generateSqlQuery.mockReturnValue(mockSql)
    exportQueryToJsonFile.mockResolvedValue(mockData)

    const result = await getAPARReportData(null, null, AP)

    const builder = buildFilter()
    expect(builder.whereNotNull).toHaveBeenCalledWith('apValue')
    expect(builder.whereNotNull).toHaveBeenCalledWith('daxFileName')
    expect(builder.whereBetween).not.toHaveBeenCalled()
    expect(exportQueryToJsonFile).toHaveBeenCalledWith(mockSql)
    expect(result).toEqual(mockData)
  })
})

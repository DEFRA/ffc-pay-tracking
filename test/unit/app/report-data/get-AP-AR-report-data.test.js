jest.mock('../../../../app/data')
jest.mock('../../../../app/report-data/report-file-generator.js', () => ({
  generateSqlQuery: jest.fn(),
  exportQueryToJsonFile: jest.fn()
}))

const { getAPARReportData } = require('../../../../app/report-data/get-AP-AR-report-data')
const db = require('../../../../app/data')
const { generateSqlQuery, exportQueryToJsonFile } = require('../../../../app/report-data/report-file-generator.js')
const { AP, AR } = require('../../../../app/constants/ledgers')

describe('getAPARReportData', () => {
  beforeEach(() => {
    db.Sequelize = {
      Op: {
        ne: 'NE_OP',
        between: 'BETWEEN_OP'
      }
    }
  })

  test('should generate SQL and export AP data when start and end dates are provided', async () => {
    const mockSql = 'SELECT * FROM reportData WHERE ...'
    const mockData = [{ apValue: 1 }, { apValue: 2 }]
    generateSqlQuery.mockResolvedValue(mockSql)
    exportQueryToJsonFile.mockResolvedValue(mockData)

    const startDate = '2022-01-01'
    const endDate = '2022-12-31'
    const result = await getAPARReportData(startDate, endDate, AP)

    expect(generateSqlQuery).toHaveBeenCalledWith({
      apValue: { NE_OP: null },
      daxFileName: { NE_OP: null },
      lastUpdated: { BETWEEN_OP: [startDate, endDate] }
    })
    expect(exportQueryToJsonFile).toHaveBeenCalledWith(mockSql)
    expect(result).toEqual(mockData)
  })

  test('should generate SQL and export AR data when start and end dates are provided', async () => {
    const mockSql = 'SELECT * FROM reportData WHERE ...'
    const mockData = [{ arValue: 1 }, { arValue: 2 }]
    generateSqlQuery.mockResolvedValue(mockSql)
    exportQueryToJsonFile.mockResolvedValue(mockData)

    const startDate = '2022-01-01'
    const endDate = '2022-12-31'
    const result = await getAPARReportData(startDate, endDate, AR)

    expect(generateSqlQuery).toHaveBeenCalledWith({
      arValue: { NE_OP: null },
      daxFileName: { NE_OP: null },
      lastUpdated: { BETWEEN_OP: [startDate, endDate] }
    })
    expect(exportQueryToJsonFile).toHaveBeenCalledWith(mockSql)
    expect(result).toEqual(mockData)
  })
})

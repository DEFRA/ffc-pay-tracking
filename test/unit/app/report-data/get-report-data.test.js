const { getReportData } = require('../../../../app/report-data/get-report-data')
const reportFileGenerator = require('../../../../app/report-data/report-file-generator')

jest.mock('../../../../app/report-data/report-file-generator', () => ({
  generateSqlQuery: jest.fn(),
  exportQueryToJsonFile: jest.fn()
}))

describe('getReportData', () => {
  const mockSql = 'SELECT * FROM reports'
  const mockJsonData = [{ id: 1, value: 'Test' }]

  beforeEach(() => {
    reportFileGenerator.generateSqlQuery.mockReturnValue(mockSql)
    reportFileGenerator.exportQueryToJsonFile.mockResolvedValue(mockJsonData)
  })

  test('should generate SQL and export JSON data', async () => {
    const result = await getReportData()

    expect(reportFileGenerator.generateSqlQuery).toHaveBeenCalled()
    expect(reportFileGenerator.exportQueryToJsonFile).toHaveBeenCalledWith(mockSql)
    expect(result).toEqual(mockJsonData)
  })
})

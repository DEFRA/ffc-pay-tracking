const reportFileGenerator = require('../../../../app/report-data/report-file-generator')
const { getRequestEditorReportData } = require('../../../../app/report-data/get-request-editor-report-data')

const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock()

jest.mock('../../../../app/report-data/report-file-generator', () => ({
  generateSqlQuery: jest.fn(),
  exportQueryToJsonFile: jest.fn()
}))

describe('getRequestEditorReportData', () => {
  const mockSql = 'SELECT * FROM report WHERE routedToRequestEditor = "Y"'
  const mockData = [{ id: 1, routedToRequestEditor: 'Y' }]

  beforeEach(() => {
    reportFileGenerator.generateSqlQuery.mockReturnValue(mockSql)
    reportFileGenerator.exportQueryToJsonFile.mockResolvedValue(mockData)
  })

  test('should generate SQL with correct where clause and export JSON', async () => {
    const result = await getRequestEditorReportData()

    const applyFilter = reportFileGenerator.generateSqlQuery.mock.calls[0][0]
    applyFilter(mockDb.builder)

    expect(mockDb.builder.where).toHaveBeenCalledWith('routedToRequestEditor', 'Y')
    expect(mockDb.builder.whereNotNull).toHaveBeenCalledWith('receivedInRequestEditor')

    expect(reportFileGenerator.exportQueryToJsonFile).toHaveBeenCalledWith(mockSql)
    expect(result).toEqual(mockData)
  })
})

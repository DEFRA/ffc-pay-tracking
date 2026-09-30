const mockGetSourceSystemFromSchemeId = jest.fn()
const mockGenerateSqlQuery = jest.fn()
const mockExportQueryToJsonFile = jest.fn()

const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock()

jest.mock('ffc-pay-schemes', () => ({
  getSourceSystemFromSchemeId: mockGetSourceSystemFromSchemeId
}))

jest.mock('../../../../app/report-data/report-file-generator', () => ({
  generateSqlQuery: mockGenerateSqlQuery,
  exportQueryToJsonFile: mockExportQueryToJsonFile
}))

const { getFilteredReportData } = require('../../../../app/report-data/get-filtered-report-data')
const { UNKNOWN } = require('../../../../app/constants/unknown')

describe('getFilteredReportData', () => {
  const schemeId = 6
  const sourceSystem = 'BPS'

  const applyFilter = () => {
    mockGenerateSqlQuery.mock.calls[0][0](mockDb.builder)
    return mockDb.builder
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetSourceSystemFromSchemeId.mockReturnValue(sourceSystem)
    mockGenerateSqlQuery.mockResolvedValue('generated SQL')
    mockExportQueryToJsonFile.mockResolvedValue('/path/to/report.json')
  })

  test('generates and exports a report using all filters', async () => {
    const result = await getFilteredReportData(
      schemeId,
      2023,
      4,
      'Revenue',
      1234567890
    )

    const builder = applyFilter()

    expect(mockGetSourceSystemFromSchemeId).toHaveBeenCalledWith(schemeId)
    expect(builder.where).toHaveBeenCalledWith({ sourceSystem })
    expect(builder.whereNotNull).toHaveBeenCalledWith('value')
    expect(builder.where).toHaveBeenCalledWith('year', 2023)
    expect(builder.where).toHaveBeenCalledWith('paymentRequestNumber', 4)
    expect(builder.where).toHaveBeenCalledWith('revenueOrCapital', 'Revenue')
    expect(builder.where).toHaveBeenCalledWith('frn', 1234567890)
    expect(mockExportQueryToJsonFile).toHaveBeenCalledWith(
      'generated SQL',
      sourceSystem
    )
    expect(result).toBe('/path/to/report.json')
  })

  test('omits optional filters when they are not provided', async () => {
    await getFilteredReportData(schemeId)

    const builder = applyFilter()

    expect(builder.where).toHaveBeenCalledTimes(1)
    expect(builder.where).toHaveBeenCalledWith({ sourceSystem })
  })

  test('adds transaction summary filters when requested', async () => {
    await getFilteredReportData(schemeId, undefined, undefined, undefined, undefined, true)

    const builder = applyFilter()

    expect(builder.whereNotNull).toHaveBeenCalledWith('batch')
    expect(builder.whereNotNull).toHaveBeenCalledWith('routedToRequestEditor')
    expect(builder.whereNotNull).toHaveBeenCalledWith('apValue')
    expect(builder.whereNotNull).toHaveBeenCalledWith('arValue')
  })

  test('does not add transaction summary filters by default', async () => {
    await getFilteredReportData(schemeId)

    const builder = applyFilter()

    expect(builder.whereNotNull).toHaveBeenCalledTimes(1)
    expect(builder.whereNotNull).toHaveBeenCalledWith('value')
  })

  test('throws when the scheme has no source system', async () => {
    mockGetSourceSystemFromSchemeId.mockReturnValue(UNKNOWN)

    await expect(getFilteredReportData(schemeId))
      .rejects
      .toThrow(`Source system not found for schemeId: ${schemeId}`)

    expect(mockGenerateSqlQuery).not.toHaveBeenCalled()
    expect(mockExportQueryToJsonFile).not.toHaveBeenCalled()
  })
})

const mockGetSourceSystemFromSchemeId = jest.fn()
const mockGenerateSqlQuery = jest.fn()
const mockExportQueryToJsonFile = jest.fn()

jest.mock('ffc-pay-schemes', () => ({
  getSourceSystemFromSchemeId: mockGetSourceSystemFromSchemeId
}))

jest.mock('../../../../app/data', () => ({
  Sequelize: {
    Op: {
      ne: Symbol('ne')
    }
  }
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

    const whereClause = mockGenerateSqlQuery.mock.calls[0][0]

    expect(mockGetSourceSystemFromSchemeId).toHaveBeenCalledWith(schemeId)
    expect(whereClause).toMatchObject({
      sourceSystem,
      year: 2023,
      paymentRequestNumber: 4,
      revenueOrCapital: 'Revenue',
      frn: 1234567890
    })
    expect(whereClause.value).toEqual({
      [Object.getOwnPropertySymbols(whereClause.value)[0]]: null
    })
    expect(mockExportQueryToJsonFile).toHaveBeenCalledWith(
      'generated SQL',
      sourceSystem
    )
    expect(result).toBe('/path/to/report.json')
  })

  test('omits optional filters when they are not provided', async () => {
    await getFilteredReportData(schemeId)

    const whereClause = mockGenerateSqlQuery.mock.calls[0][0]

    expect(whereClause).toMatchObject({
      sourceSystem
    })
    expect(whereClause).not.toHaveProperty('year')
    expect(whereClause).not.toHaveProperty('paymentRequestNumber')
    expect(whereClause).not.toHaveProperty('revenueOrCapital')
    expect(whereClause).not.toHaveProperty('frn')
  })

  test('adds transaction summary filters when requested', async () => {
    await getFilteredReportData(schemeId, undefined, undefined, undefined, undefined, true)

    const whereClause = mockGenerateSqlQuery.mock.calls[0][0]

    expect(whereClause).toHaveProperty('batch')
    expect(whereClause).toHaveProperty('routedToRequestEditor')
    expect(whereClause).toHaveProperty('apValue')
    expect(whereClause).toHaveProperty('arValue')
  })

  test('does not add transaction summary filters by default', async () => {
    await getFilteredReportData(schemeId)

    const whereClause = mockGenerateSqlQuery.mock.calls[0][0]

    expect(whereClause).not.toHaveProperty('batch')
    expect(whereClause).not.toHaveProperty('routedToRequestEditor')
    expect(whereClause).not.toHaveProperty('apValue')
    expect(whereClause).not.toHaveProperty('arValue')
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

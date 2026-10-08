const mockGetReportingDataFilter = jest.fn()
const mockGetSourceSystemFromSchemeId = jest.fn()

jest.mock('ffc-pay-schemes', () => ({
  getReportingDataFilter: mockGetReportingDataFilter,
  getSourceSystemFromSchemeId: mockGetSourceSystemFromSchemeId
}))

jest.mock('../../../../app/report-data/report-file-generator', () => ({
  exportQueryToJsonFile: jest.fn()
}))

const { getClaimLevelReportData } = require('../../../../app/report-data/get-claim-level-report-data')
const { exportQueryToJsonFile } = require('../../../../app/report-data/report-file-generator')
const { UNKNOWN } = require('../../../../app/constants/unknown')

const BPS = 6
const CS = 7
const DELINKED = 8

const normalizeSql = sql => sql.replace(/\s+/g, ' ').trim()

describe('getClaimLevelReportData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetReportingDataFilter.mockReturnValue([])
    exportQueryToJsonFile.mockResolvedValue('/path/to/claim-level-report.json')
  })

  test('generates SQL using reporting fields from ffc-pay-schemes', async () => {
    mockGetSourceSystemFromSchemeId.mockReturnValue('BPS')
    mockGetReportingDataFilter.mockReturnValue([
      'agreementNumber',
      'marketingYear'
    ])

    const result = await getClaimLevelReportData(BPS, 2023, 'Revenue', 1234567890)
    const sql = normalizeSql(exportQueryToJsonFile.mock.calls[0][0])

    expect(mockGetSourceSystemFromSchemeId).toHaveBeenCalledWith(BPS)
    expect(mockGetReportingDataFilter).toHaveBeenCalledWith(BPS)
    expect(sql).toContain(
      'PARTITION BY "sourceSystem", frn, "agreementNumber", "marketingYear"'
    )
    expect(sql).toContain('"sourceSystem" = \'BPS\'')
    expect(sql).toContain('"year" = 2023')
    expect(sql).toContain('"frn" = 1234567890')
    expect(sql).toContain('"revenueOrCapital" = \'Revenue\'')
    expect(exportQueryToJsonFile).toHaveBeenCalledWith(
      expect.any(String),
      'BPS'
    )
    expect(result).toBe('/path/to/claim-level-report.json')
  })

  test('uses the reporting fields returned for the scheme', async () => {
    mockGetSourceSystemFromSchemeId.mockReturnValue('CS')
    mockGetReportingDataFilter.mockReturnValue(['contractNumber'])

    await getClaimLevelReportData(CS, 2023)

    const sql = normalizeSql(exportQueryToJsonFile.mock.calls[0][0])

    expect(sql).toContain(
      'PARTITION BY "sourceSystem", frn, "contractNumber"'
    )
  })

  test('generates no additional partition fields when none are returned', async () => {
    mockGetSourceSystemFromSchemeId.mockReturnValue('DP')

    await getClaimLevelReportData(DELINKED, 2023)

    const sql = normalizeSql(exportQueryToJsonFile.mock.calls[0][0])

    expect(sql).toContain('PARTITION BY "sourceSystem", frn')
    expect(sql).not.toContain('"agreementNumber"')
    expect(sql).not.toContain('"contractNumber"')
  })

  test('omits optional filters when they are not provided', async () => {
    mockGetSourceSystemFromSchemeId.mockReturnValue('BPS')

    await getClaimLevelReportData(BPS)

    const sql = normalizeSql(exportQueryToJsonFile.mock.calls[0][0])

    expect(sql).not.toContain('"year" =')
    expect(sql).not.toContain('"frn" =')
    expect(sql).not.toContain('"revenueOrCapital" =')
  })

  test('throws when no source system is found', async () => {
    mockGetSourceSystemFromSchemeId.mockReturnValue(UNKNOWN)

    await expect(getClaimLevelReportData('invalidSchemeId'))
      .rejects
      .toThrow('Source system not found for schemeId: invalidSchemeId')

    expect(exportQueryToJsonFile).not.toHaveBeenCalled()
  })
})

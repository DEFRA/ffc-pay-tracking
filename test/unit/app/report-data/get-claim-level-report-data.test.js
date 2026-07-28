const { getClaimLevelReportData } = require('../../../../app/report-data/get-claim-level-report-data')
const { BPS, CS, DELINKED } = require('../../../../app/constants/source-systems')
const { getSourceSystem } = require('../../../../app/helpers/get-source-system')
const { exportQueryToJsonFile } = require('../../../../app/report-data/report-file-generator')

jest.mock('../../../../app/helpers/get-source-system')
jest.mock('../../../../app/report-data/report-file-generator')

const normalizeSql = (sql) => sql.replace(/\s+/g, ' ').trim()

describe('getClaimLevelReportData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should generate the correct SQL and call exportQueryToJsonFile', async () => {
    const schemeId = BPS
    const year = 2023
    const revenueOrCapital = 'Revenue'
    const frn = 1234567890
    const sourceSystem = 'BPS'

    const mockFilePath = '/path/to/claim-level-report.json'
    exportQueryToJsonFile.mockResolvedValue(mockFilePath)
    getSourceSystem.mockReturnValue(sourceSystem)

    const result = await getClaimLevelReportData(schemeId, year, revenueOrCapital, frn)
    const actualSQL = exportQueryToJsonFile.mock.calls[0][0]

    expect(getSourceSystem).toHaveBeenCalledWith(schemeId)
    expect(normalizeSql(actualSQL)).toContain(
      'PARTITION BY "sourceSystem", frn, "agreementNumber", "marketingYear"'
    )
    expect(normalizeSql(actualSQL)).toContain(`"sourceSystem" = '${sourceSystem}'`)
    expect(normalizeSql(actualSQL)).toContain(`"year" = ${year}`)
    expect(normalizeSql(actualSQL)).toContain(`"frn" = ${frn}`)
    expect(normalizeSql(actualSQL)).toContain(`"revenueOrCapital" = '${revenueOrCapital}'`)
    expect(result).toBe(mockFilePath)
  })

  test('should throw an error if source system is not found', async () => {
    const schemeId = 'invalidSchemeId'
    getSourceSystem.mockReturnValue(null)

    await expect(getClaimLevelReportData(schemeId))
      .rejects.toThrow('Source system not found for schemeId: invalidSchemeId')
  })

  test('should return the file path from exportQueryToJsonFile', async () => {
    const schemeId = CS
    const year = 2023
    const mockFilePath = '/path/to/claim-level-report.json'
    const sourceSystem = 'CS'

    exportQueryToJsonFile.mockResolvedValue(mockFilePath)
    getSourceSystem.mockReturnValue(sourceSystem)

    const result = await getClaimLevelReportData(schemeId, year)
    expect(result).toBe(mockFilePath)
  })

  test.each([
    { schemeId: BPS, sourceSystem: 'BPS', additionalProperty1: 'agreementNumber', additionalProperty2: 'marketingYear' },
    { schemeId: CS, sourceSystem: 'SITI AGRI CS SYS', additionalProperty1: 'claimNumber', additionalProperty2: null },
  ])('should generate SQL with correct partitioning for $sourceSystem source system', async ({ schemeId, sourceSystem, additionalProperty1, additionalProperty2 }) => {
    const year = 2023

    let expectedPartitionClause = 'PARTITION BY "sourceSystem", frn'

    if (additionalProperty1) {
      expectedPartitionClause += `, "${additionalProperty1}"`
    }
    if (additionalProperty2) {
      expectedPartitionClause += `, "${additionalProperty2}"`
    }

    expectedPartitionClause = expectedPartitionClause.replace(/\s+/g, ' ').trim()

    const mockFilePath = '/path/to/claim-level-report.json'
    exportQueryToJsonFile.mockResolvedValue(mockFilePath)
    getSourceSystem.mockReturnValue(sourceSystem)

    await getClaimLevelReportData(schemeId, year)

    const sql = exportQueryToJsonFile.mock.calls[0][0]
    const normalizedSql = normalizeSql(sql)

    expect(normalizedSql).toContain(expectedPartitionClause)
  })

  test('should generate SQL with correct partitioning for DELINKED source system', async () => {
    const schemeId = DELINKED
    const sourceSystem = 'DP'
    const mockFilePath = '/path/to/claim-level-report.json'

    exportQueryToJsonFile.mockResolvedValue(mockFilePath)
    getSourceSystem.mockReturnValue(sourceSystem)

    await getClaimLevelReportData(schemeId, 2023)

    const sql = exportQueryToJsonFile.mock.calls[0][0]
    const normalizedSql = normalizeSql(sql)

    expect(normalizedSql).toContain('PARTITION BY "sourceSystem", frn')
    expect(normalizedSql).not.toContain('"agreementNumber"')
    expect(normalizedSql).not.toContain('"claimNumber"')
  })

  test('should generate SQL without year filter when year is not provided', async () => {
    const schemeId = BPS
    const sourceSystem = 'BPS'
    const mockFilePath = '/path/to/claim-level-report.json'

    exportQueryToJsonFile.mockResolvedValue(mockFilePath)
    getSourceSystem.mockReturnValue(sourceSystem)

    await getClaimLevelReportData(schemeId)

    const sql = exportQueryToJsonFile.mock.calls[0][0]
    const normalizedSql = normalizeSql(sql)

    expect(normalizedSql).not.toContain('"year" =')
    expect(normalizedSql).toContain(`"sourceSystem" = '${sourceSystem}'`)
  })

  test('should generate SQL without frn filter when frn is not provided', async () => {
    const schemeId = BPS
    const year = 2023
    const sourceSystem = 'BPS'
    const mockFilePath = '/path/to/claim-level-report.json'

    exportQueryToJsonFile.mockResolvedValue(mockFilePath)
    getSourceSystem.mockReturnValue(sourceSystem)

    await getClaimLevelReportData(schemeId, year, null, null)

    const sql = exportQueryToJsonFile.mock.calls[0][0]
    const normalizedSql = normalizeSql(sql)

    expect(normalizedSql).not.toContain('"frn" =')
    expect(normalizedSql).toContain(`"year" = ${year}`)
    expect(normalizedSql).toContain(`"sourceSystem" = '${sourceSystem}'`)
  })

  test('should generate SQL without revenueOrCapital filter when it is not provided', async () => {
    const schemeId = BPS
    const year = 2023
    const frn = 1234567890
    const sourceSystem = 'BPS'
    const mockFilePath = '/path/to/claim-level-report.json'

    exportQueryToJsonFile.mockResolvedValue(mockFilePath)
    getSourceSystem.mockReturnValue(sourceSystem)

    await getClaimLevelReportData(schemeId, year, null, frn)

    const sql = exportQueryToJsonFile.mock.calls[0][0]
    const normalizedSql = normalizeSql(sql)

    expect(normalizedSql).not.toContain('"revenueOrCapital" =')
    expect(normalizedSql).toContain(`"year" = ${year}`)
    expect(normalizedSql).toContain(`"frn" = ${frn}`)
    expect(normalizedSql).toContain(`"sourceSystem" = '${sourceSystem}'`)
  })
})

const schemes = require('../../../../app/constants/schemes')
const sourceSystems = require('../../../../app/constants/source-systems')
const { getFilteredReportData } = require('../../../../app/report-data/get-filtered-report-data')
const { getSourceSystem } = require('../../../../app/helpers/get-source-system')
const { generateSqlQuery, exportQueryToJsonFile } = require('../../../../app/report-data/report-file-generator')

jest.mock('../../../../app/helpers/get-source-system')
jest.mock('../../../../app/report-data/report-file-generator', () => ({
  generateSqlQuery: jest.fn(),
  exportQueryToJsonFile: jest.fn()
}))

describe('getFilteredReportData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return data when all parameters are provided', async () => {
    const schemeId = schemes.SFI
    const year = 2023
    const paymentRequestNumber = 1
    const revenueOrCapital = 'revenue'
    const frn = 1234567890
    const mockSql = 'SELECT * FROM filtered_data'
    const mockData = [{ id: 1, mock: 'data' }]

    getSourceSystem.mockReturnValue(sourceSystems.SFI)
    generateSqlQuery.mockResolvedValue(mockSql)
    exportQueryToJsonFile.mockResolvedValue(mockData)

    const result = await getFilteredReportData(schemeId, year, paymentRequestNumber, revenueOrCapital, frn)

    expect(result).toEqual(mockData)
    expect(getSourceSystem).toHaveBeenCalledWith(schemeId)
    expect(generateSqlQuery).toHaveBeenCalledWith(expect.objectContaining({
      sourceSystem: sourceSystems.SFI,
      year,
      paymentRequestNumber,
      revenueOrCapital,
      frn
    }))
    expect(exportQueryToJsonFile).toHaveBeenCalledWith(mockSql, sourceSystems.SFI)
  })

  test('should return data when frn is not provided', async () => {
    const schemeId = schemes.SFI
    const year = 2023
    const paymentRequestNumber = 1
    const revenueOrCapital = 'capital'
    const mockSql = 'SELECT * FROM filtered_data'
    const mockData = [{ id: 1, mock: 'data' }]

    getSourceSystem.mockReturnValue(sourceSystems.SFI)
    generateSqlQuery.mockResolvedValue(mockSql)
    exportQueryToJsonFile.mockResolvedValue(mockData)

    const result = await getFilteredReportData(schemeId, year, paymentRequestNumber, revenueOrCapital)

    expect(result).toEqual(mockData)
    expect(generateSqlQuery).toHaveBeenCalledWith(expect.not.objectContaining({ frn: expect.anything() }))
  })

  test('should return data when only frn is provided', async () => {
    const schemeId = schemes.SFI
    const frn = 1234567890
    const mockSql = 'SELECT * FROM filtered_data'
    const mockData = [{ id: 1, frn, value: 'test data' }]

    getSourceSystem.mockReturnValue(sourceSystems.SFI)
    generateSqlQuery.mockResolvedValue(mockSql)
    exportQueryToJsonFile.mockResolvedValue(mockData)

    const result = await getFilteredReportData(schemeId, undefined, undefined, undefined, frn)

    expect(result).toEqual(mockData)
    expect(generateSqlQuery).toHaveBeenCalledWith(expect.objectContaining({ frn }))
  })

  test('should throw an error when source system is not found', async () => {
    const schemeId = 999

    getSourceSystem.mockReturnValue(undefined)

    await expect(getFilteredReportData(schemeId)).rejects.toThrow(
      `Source system not found for schemeId: ${schemeId}`
    )

    expect(generateSqlQuery).not.toHaveBeenCalled()
    expect(exportQueryToJsonFile).not.toHaveBeenCalled()
  })

  test.each([
    [schemes.SFI, sourceSystems.SFI],
    [schemes.SFI_PILOT, sourceSystems.SFI_PILOT],
    [schemes.LUMP_SUMS, sourceSystems.LUMP_SUMS],
    [schemes.VET_VISITS, sourceSystems.VET_VISITS],
    [schemes.CS, sourceSystems.CS],
    [schemes.BPS, sourceSystems.BPS],
    [schemes.FDMR, sourceSystems.FDMR],
    [schemes.MANUAL, sourceSystems.MANUAL],
    [schemes.ES, sourceSystems.ES],
    [schemes.FC, sourceSystems.FC],
    [schemes.IMPS, sourceSystems.IMPS],
    [schemes.SFI23, sourceSystems.SFI23],
    [schemes.DELINKED, sourceSystems.DELINKED],
    [schemes.SFI_EXPANDED, sourceSystems.SFI_EXPANDED]
  ])('should handle schemeId %s with correct source system %s', async (schemeId, expectedSourceSystem) => {
    const mockSql = 'SELECT * FROM data'
    const mockData = [{ id: 123 }]

    getSourceSystem.mockReturnValue(expectedSourceSystem)
    generateSqlQuery.mockResolvedValue(mockSql)
    exportQueryToJsonFile.mockResolvedValue(mockData)

    const result = await getFilteredReportData(schemeId)

    expect(result).toEqual(mockData)
    expect(getSourceSystem).toHaveBeenCalledWith(schemeId)
    expect(generateSqlQuery).toHaveBeenCalledWith(expect.objectContaining({
      sourceSystem: expectedSourceSystem
    }))
    expect(exportQueryToJsonFile).toHaveBeenCalledWith(mockSql, expectedSourceSystem)
  })
})

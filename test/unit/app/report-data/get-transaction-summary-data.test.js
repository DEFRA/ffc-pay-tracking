const schemes = require('../../../../app/constants/schemes')
const sourceSystems = require('../../../../app/constants/source-systems')
const db = require('../../../../app/data')
const { getTransactionSummaryData } = require('../../../../app/report-data/get-transaction-summary-data')

jest.mock('../../../../app/data', () => ({
  reportData: {
    findAll: jest.fn()
  }
}))

describe('get transaction summary data', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return data when source system is found', async () => {
    const schemeId = schemes.SFI
    const frn = 1234567890
    const mockData = [{ id: 1, frn: 1234567890, value: 'test data' }]

    db.reportData.findAll.mockResolvedValue(mockData)

    const result = await getTransactionSummaryData(schemeId, frn)

    expect(result).toEqual(mockData)
    expect(db.reportData.findAll).toHaveBeenCalledWith({
      where: {
        sourceSystem: sourceSystems.SFI,
        frn
      },
      raw: true
    })
  })

  test('should return data when frn is not provided', async () => {
    const schemeId = schemes.SFI
    const mockData = [{ id: 1, value: 'test data' }]

    db.reportData.findAll.mockResolvedValue(mockData)

    const result = await getTransactionSummaryData(schemeId)

    expect(result).toEqual(mockData)
    expect(db.reportData.findAll).toHaveBeenCalledWith({
      where: {
        sourceSystem: sourceSystems.SFI
      },
      raw: true
    })
  })

  test('should throw an error when source system is not found', async () => {
    const schemeId = 999

    await expect(getTransactionSummaryData(schemeId)).rejects.toThrow(
      `Source system not found for schemeId: ${schemeId}`
    )
    expect(db.reportData.findAll).not.toHaveBeenCalled()
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
  ])('should call findAll with correct source system for schemeId %s', async (schemeId, expectedSourceSystem) => {
    const mockData = [{ id: 1, value: 'test data' }]
    db.reportData.findAll.mockResolvedValue(mockData)

    const result = await getTransactionSummaryData(schemeId)

    expect(result).toEqual(mockData)
    expect(db.reportData.findAll).toHaveBeenCalledWith({
      where: {
        sourceSystem: expectedSourceSystem
      },
      raw: true
    })
  })
})

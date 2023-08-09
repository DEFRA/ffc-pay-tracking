const { getSchemeId } = require('../../../app/tracking/get-scheme-id')

const { SFI, SFI_PILOT, LUMP_SUMS, VET_VISITS, CS, BPS, FDMR, MANUAL, ES, FC, IMPS } = require('../../../app/constants/schemes')

let sourceSystem

describe('get scheme id', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  test('should return scheme id as 1 when SITI_SFI source system supplied', async () => {
    sourceSystem = 'SITI_SFI'
    const schemeId = await getSchemeId(sourceSystem)
    expect(schemeId).toBe(SFI)
  })

  test('should return scheme id as 2 when SFIP source system supplied', async () => {
    sourceSystem = 'SFIP'
    const schemeId = await getSchemeId(sourceSystem)
    expect(schemeId).toBe(SFI_PILOT)
  })

  test('should return scheme id as 3 when LSES source system supplied', async () => {
    sourceSystem = 'LSES'
    const schemeId = await getSchemeId(sourceSystem)
    expect(schemeId).toBe(LUMP_SUMS)
  })

  test('should return scheme id as 4 when AHWR source system supplied', async () => {
    sourceSystem = 'AHWR'
    const schemeId = await getSchemeId(sourceSystem)
    expect(schemeId).toBe(VET_VISITS)
  })

  test('should return scheme id as 5 when SITI AGRI CS SYS source system supplied', async () => {
    sourceSystem = 'SITI AGRI CS SYS'
    const schemeId = await getSchemeId(sourceSystem)
    expect(schemeId).toBe(CS)
  })

  test('should return scheme id as 6 when SITI AGRI SYS source system supplied', async () => {
    sourceSystem = 'SITI AGRI SYS'
    const schemeId = await getSchemeId(sourceSystem)
    expect(schemeId).toBe(BPS)
  })

  test('should return scheme id as 7 when FDMR source system supplied', async () => {
    sourceSystem = 'FDMR'
    const schemeId = await getSchemeId(sourceSystem)
    expect(schemeId).toBe(FDMR)
  })

  test('should return scheme id as 8 when Manual source system supplied', async () => {
    sourceSystem = 'Manual'
    const schemeId = await getSchemeId(sourceSystem)
    expect(schemeId).toBe(MANUAL)
  })

  test('should return scheme id as 9 when Genesis source system supplied', async () => {
    sourceSystem = 'Genesis'
    const schemeId = await getSchemeId(sourceSystem)
    expect(schemeId).toBe(ES)
  })

  test('should return scheme id as 10 when GLOS source system supplied', async () => {
    sourceSystem = 'GLOS'
    const schemeId = await getSchemeId(sourceSystem)
    expect(schemeId).toBe(FC)
  })

  test('should return scheme id as 11 when IMPS source system supplied', async () => {
    sourceSystem = 'IMPS'
    const schemeId = await getSchemeId(sourceSystem)
    expect(schemeId).toBe(IMPS)
  })

  test('should return undefined if source system does not exist', async () => {
    const schemeId = await getSchemeId('')
    expect(schemeId).toBeUndefined()
  })
})

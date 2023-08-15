const { getSchemeId } = require('../../../app/tracking/get-scheme-id')

const { SFI, SFI_PILOT, LUMP_SUMS, VET_VISITS, CS, BPS, FDMR, MANUAL, ES, FC, IMPS } = require('../../../app/constants/schemes')
const { sfi, sfip, lses, ahwr, cs, bps, fdmr, manual, genesis, glos, imps } = require('../../../app/constants/source-systems')

let invoiceNumber

describe('get scheme id', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  test('should return scheme id as 1 when SITI_SFI source system supplied', async () => {
    const schemeId = await getSchemeId(sfi)
    expect(schemeId).toBe(SFI)
  })

  test('should return scheme id as 2 when SITISFI source system supplied', async () => {
    const schemeId = await getSchemeId(sfip)
    expect(schemeId).toBe(SFI_PILOT)
  })

  test('should return scheme id as 3 when SitiLUMP source system supplied', async () => {
    const schemeId = await getSchemeId(lses)
    expect(schemeId).toBe(LUMP_SUMS)
  })

  test('should return scheme id as 4 when AHWR source system supplied', async () => {
    const schemeId = await getSchemeId(ahwr)
    expect(schemeId).toBe(VET_VISITS)
  })

  test('should return scheme id as 5 when SITICS source system supplied', async () => {
    const schemeId = await getSchemeId(cs)
    expect(schemeId).toBe(CS)
  })

  test('should return scheme id as 6 when SITIAgri source system and bps invoice number supplied', async () => {
    invoiceNumber = 'S000000100000001V001'
    const schemeId = await getSchemeId(bps, invoiceNumber)
    expect(schemeId).toBe(BPS)
  })

  test('should return scheme id as 7 when SITIAgri source system and fdmr invoice number supplied', async () => {
    invoiceNumber = 'F000000100000001V001'
    const schemeId = await getSchemeId(fdmr, invoiceNumber)
    expect(schemeId).toBe(FDMR)
  })

  test('should return scheme id as 8 when M_TEMPLATE source system supplied', async () => {
    const schemeId = await getSchemeId(manual)
    expect(schemeId).toBe(MANUAL)
  })

  test('should return scheme id as 9 when Genesis source system supplied', async () => {
    const schemeId = await getSchemeId(genesis)
    expect(schemeId).toBe(ES)
  })

  test('should return scheme id as 10 when GLOS source system supplied', async () => {
    const schemeId = await getSchemeId(glos)
    expect(schemeId).toBe(FC)
  })

  test('should return scheme id as 11 when IMPS source system supplied', async () => {
    const schemeId = await getSchemeId(imps)
    expect(schemeId).toBe(IMPS)
  })

  test('should return undefined if source system does not exist', async () => {
    const schemeId = await getSchemeId('')
    expect(schemeId).toBeUndefined()
  })
})

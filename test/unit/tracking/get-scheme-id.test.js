const { getSchemeId } = require('../../../app/tracking/get-scheme-id')

const { SFI, SFI_PILOT, LUMP_SUMS, VET_VISITS, CS, BPS, FDMR, MANUAL, ES, FC, IMPS } = require('../../../app/constants/schemes')
const { sfi, sfip, lses, ahwr, cs, bps, fdmr, manual, genesis, glos, imps } = require('../../../app/constants/source-systems')

let invoiceNumber

describe('get scheme id', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return scheme id as 1 when SITI_SFI source system supplied', () => {
    const schemeId = getSchemeId(sfi)
    expect(schemeId).toBe(SFI)
  })

  test('should return scheme id as 2 when SITISFI source system supplied', () => {
    const schemeId = getSchemeId(sfip)
    expect(schemeId).toBe(SFI_PILOT)
  })

  test('should return scheme id as 3 when SitiLUMP source system supplied', () => {
    const schemeId = getSchemeId(lses)
    expect(schemeId).toBe(LUMP_SUMS)
  })

  test('should return scheme id as 4 when AHWR source system supplied', () => {
    const schemeId = getSchemeId(ahwr)
    expect(schemeId).toBe(VET_VISITS)
  })

  test('should return scheme id as 5 when SITICS source system supplied', () => {
    const schemeId = getSchemeId(cs)
    expect(schemeId).toBe(CS)
  })

  test('should return scheme id as 6 when SITIAgri source system and bps invoice number supplied', () => {
    invoiceNumber = 'S000000100000001V001'
    const schemeId = getSchemeId(bps, invoiceNumber)
    expect(schemeId).toBe(BPS)
  })

  test('should return scheme id as 7 when SITIAgri source system and fdmr invoice number supplied', () => {
    invoiceNumber = 'F000000100000001V001'
    const schemeId = getSchemeId(fdmr, invoiceNumber)
    expect(schemeId).toBe(FDMR)
  })

  test('should return scheme id as 8 when M_TEMPLATE source system supplied', () => {
    const schemeId = getSchemeId(manual)
    expect(schemeId).toBe(MANUAL)
  })

  test('should return scheme id as 9 when Genesis source system supplied', () => {
    const schemeId = getSchemeId(genesis)
    expect(schemeId).toBe(ES)
  })

  test('should return scheme id as 10 when GLOS source system supplied', () => {
    const schemeId = getSchemeId(glos)
    expect(schemeId).toBe(FC)
  })

  test('should return scheme id as 11 when IMPS source system supplied', () => {
    const schemeId = getSchemeId(imps)
    expect(schemeId).toBe(IMPS)
  })

  test('should return undefined if source system does not exist', () => {
    const schemeId = getSchemeId('')
    expect(schemeId).toBeUndefined()
  })
})

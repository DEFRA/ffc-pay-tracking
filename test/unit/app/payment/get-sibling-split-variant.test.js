const ffcPaySchemes = require('ffc-pay-schemes')

jest.spyOn(ffcPaySchemes, 'getSchemeIdFromSourceSystem').mockImplementation((sourceSystem) => {
  if (sourceSystem === ffcPaySchemes.getSourceSystems().SFI) {
    return 1
  }
  if (sourceSystem === ffcPaySchemes.getSourceSystems().FPTT) {
    return 18
  }
  return undefined
})

jest.spyOn(ffcPaySchemes, 'isSitiAgri').mockImplementation((schemeId) => {
  return schemeId === 1
})

const { getSiblingSplitVariant } = require('../../../../app/payment/get-sibling-split-variant')

describe('getSiblingSplitVariant', () => {
  const { SFI, FPTT } = ffcPaySchemes.getSourceSystems()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('swaps A to B at index 8 for SITI_AGRI invoices', () => {
    const invoiceNumber = 'S0000001AVXYZ'
    expect(getSiblingSplitVariant(invoiceNumber, SFI)).toBe('S0000001BVXYZ')
  })

  test('swaps B to A at index 8 for SITI_AGRI invoices', () => {
    const invoiceNumber = 'S0000001BVXYZ'
    expect(getSiblingSplitVariant(invoiceNumber, SFI)).toBe('S0000001AVXYZ')
  })

  test('swaps A to B at length-4 index for default invoices', () => {
    const invoiceNumber = 'INV12345AV01'
    expect(getSiblingSplitVariant(invoiceNumber, FPTT)).toBe('INV12345BV01')
  })

  test('swaps B to A at length-4 index for default invoices', () => {
    const invoiceNumber = 'INV12345BV01'
    expect(getSiblingSplitVariant(invoiceNumber, FPTT)).toBe('INV12345AV01')
  })

  test('returns null when the inserted character is not A or B', () => {
    expect(getSiblingSplitVariant('INV12345CV01', FPTT)).toBeNull()
  })

  test('returns null for invalid or too-short invoice numbers', () => {
    expect(getSiblingSplitVariant('', FPTT)).toBeNull()
    expect(getSiblingSplitVariant('ABC', FPTT)).toBeNull()
  })
})

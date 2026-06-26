const createSplitInvoiceNumber = require('../../../../app/payment/create-split-invoice-number')
const {
  SFI,
  SFI_PILOT,
  LUMP_SUMS,
  CS,
  BPS,
  SFI23,
  DELINKED,
  SFI_EXPANDED,
  COHT_REVENUE,
  COHT_CAPITAL
} = require('../../../../app/constants/source-systems')

describe('createSplitInvoiceNumber', () => {
  const sitiAgriSources = [
    SFI,
    SFI_PILOT,
    LUMP_SUMS,
    CS,
    BPS,
    SFI23,
    DELINKED,
    SFI_EXPANDED,
    COHT_REVENUE,
    COHT_CAPITAL
  ]

  test('creates default split invoice number by inserting splitId before the final element and trimming one char', () => {
    const original = 'INV123456V001'
    const resultA = createSplitInvoiceNumber(original, 'A', 'FPTT')
    const resultB = createSplitInvoiceNumber(original, 'B', 'FPTT')

    expect(resultA).toBe('INV123456AV01')
    expect(resultB).toBe('INV123456BV01')
  })

  test.each(sitiAgriSources)('creates SITI_AGRI split invoice number for %s', (sourceSystem) => {
    const original = 'S0000001ABCD001'
    const splitA = createSplitInvoiceNumber(original, 'A', sourceSystem)
    const splitB = createSplitInvoiceNumber(original, 'B', sourceSystem)

    expect(splitA).toBe(`${original.slice(0, 8)}A${original.slice(8, -3)}${original.slice(-2)}`)
    expect(splitB).toBe(`${original.slice(0, 8)}B${original.slice(8, -3)}${original.slice(-2)}`)
  })
})

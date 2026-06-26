const { getOriginalInvoiceNumberLike } = require('../../../../app/payment/get-original-invoice-number-like')
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

describe('getOriginalInvoiceNumberLike', () => {
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

  test('returns null for no invoiceNumber', () => {
    expect(getOriginalInvoiceNumberLike(null, 'FPTT')).toBeNull()
  })

  test.each(sitiAgriSources)('returns first 8 chars plus wildcard for SITI_AGRI source %s', (sourceSystem) => {
    const invoiceNumber = 'S0000001ABCD'
    expect(getOriginalInvoiceNumberLike(invoiceNumber, sourceSystem)).toBe('S0000001%')
  })

  test('returns null for SITI_AGRI invoice shorter than required length', () => {
    expect(getOriginalInvoiceNumberLike('S000000', SFI)).toBeNull()
  })

  test('returns all-but-final-4 prefix plus wildcard for default source systems', () => {
    expect(getOriginalInvoiceNumberLike('INV123456V001', 'FPTT')).toBe('INV123456%')
  })

  test('returns null for default source system when invoiceNumber is too short', () => {
    expect(getOriginalInvoiceNumberLike('ABC', 'FPTT')).toBeNull()
  })
})

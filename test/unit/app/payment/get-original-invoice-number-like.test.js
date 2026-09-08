const {
  getSchemeIdFromSourceSystem,
  isSitiAgri
} = require('ffc-pay-schemes')

jest.mock('ffc-pay-schemes', () => ({
  getSchemeIdFromSourceSystem: jest.fn(),
  isSitiAgri: jest.fn()
}))

const {
  getOriginalInvoiceNumberLike
} = require('../../../../app/payment/get-original-invoice-number-like')

describe('getOriginalInvoiceNumberLike', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test.each([undefined, null, '', 0])('returns null for falsy invoice number: %p', (invoiceNumber) => {
    expect(getOriginalInvoiceNumberLike(invoiceNumber, 'source-system')).toBeNull()
    expect(getSchemeIdFromSourceSystem).not.toHaveBeenCalled()
  })

  test('returns null for non-SITI Agri invoice numbers shorter than four characters', () => {
    getSchemeIdFromSourceSystem.mockReturnValue('scheme-id')
    isSitiAgri.mockReturnValue(false)

    expect(getOriginalInvoiceNumberLike('123', 'source-system')).toBeNull()
  })

  test('returns the invoice prefix with a wildcard for non-SITI Agri invoices', () => {
    getSchemeIdFromSourceSystem.mockReturnValue('scheme-id')
    isSitiAgri.mockReturnValue(false)

    expect(
      getOriginalInvoiceNumberLike('INV12345', 'source-system')
    ).toBe('INV1%')

    expect(getSchemeIdFromSourceSystem).toHaveBeenCalledWith('source-system')
    expect(isSitiAgri).toHaveBeenCalledWith('scheme-id')
  })

  test('returns a wildcard for a four-character non-SITI Agri invoice', () => {
    getSchemeIdFromSourceSystem.mockReturnValue('scheme-id')
    isSitiAgri.mockReturnValue(false)

    expect(getOriginalInvoiceNumberLike('1234', 'source-system')).toBe('%')
  })

  test('returns null for SITI Agri invoice numbers shorter than ten characters', () => {
    getSchemeIdFromSourceSystem.mockReturnValue('siti-scheme-id')
    isSitiAgri.mockReturnValue(true)

    expect(getOriginalInvoiceNumberLike('123456789', 'source-system')).toBeNull()
  })

  test('returns the first eight characters with a wildcard for SITI Agri invoices', () => {
    getSchemeIdFromSourceSystem.mockReturnValue('siti-scheme-id')
    isSitiAgri.mockReturnValue(true)

    expect(
      getOriginalInvoiceNumberLike('1234567890', 'source-system')
    ).toBe('12345678%')

    expect(getSchemeIdFromSourceSystem).toHaveBeenCalledWith('source-system')
    expect(isSitiAgri).toHaveBeenCalledWith('siti-scheme-id')
  })
})

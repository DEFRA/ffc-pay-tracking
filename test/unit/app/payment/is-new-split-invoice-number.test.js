const mockCreateSplitInvoiceNumber = jest.fn()
const mockGetSchemeIdFromSourceSystem = jest.fn()

jest.mock('ffc-pay-schemes', () => ({
  createSplitInvoiceNumber: mockCreateSplitInvoiceNumber,
  getSchemeIdFromSourceSystem: mockGetSchemeIdFromSourceSystem
}))

const { PAYMENT_PROCESSED } = require('../../../../app/constants/events')
const { isNewSplitInvoiceNumber } = require('../../../../app/payment/is-new-split-invoice-number')

describe('check if new split invoice number', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockGetSchemeIdFromSourceSystem.mockReturnValue(6)
  })

  test('returns true when the invoice matches the A split transform', () => {
    mockCreateSplitInvoiceNumber.mockImplementation((existingInvoice, splitId) =>
      splitId === 'A' ? 'INV123456AV01' : 'INV123456BV01'
    )

    const event = {
      type: PAYMENT_PROCESSED,
      data: { invoiceNumber: 'INV123456AV01' }
    }
    const existingData = {
      invoiceNumber: 'INV123456V001',
      sourceSystem: 'FPTT'
    }

    expect(isNewSplitInvoiceNumber(event, existingData)).toBe(true)
    expect(mockGetSchemeIdFromSourceSystem).toHaveBeenCalledWith('FPTT')
    expect(mockCreateSplitInvoiceNumber).toHaveBeenCalledWith(
      'INV123456V001', 'A', 6
    )
  })

  test('returns true when the invoice matches the B split transform', () => {
    mockCreateSplitInvoiceNumber.mockImplementation((existingInvoice, splitId) =>
      splitId === 'A' ? 'S0000001AABC01' : 'S0000001BABC01'
    )

    const event = {
      type: PAYMENT_PROCESSED,
      data: { invoiceNumber: 'S0000001BABC01' }
    }
    const existingData = {
      invoiceNumber: 'S0000001ABC001',
      sourceSystem: 'FPTT'
    }

    expect(isNewSplitInvoiceNumber(event, existingData)).toBe(true)
    expect(mockGetSchemeIdFromSourceSystem).toHaveBeenCalledWith('FPTT')
    expect(mockCreateSplitInvoiceNumber).toHaveBeenCalledWith(
      'S0000001ABC001', 'B', 6
    )
  })

  test('returns false when the invoice number is unchanged', () => {
    const event = {
      type: PAYMENT_PROCESSED,
      data: { invoiceNumber: 'INV123456V001' }
    }
    const existingData = {
      invoiceNumber: 'INV123456V001',
      sourceSystem: 'FPTT'
    }

    expect(isNewSplitInvoiceNumber(event, existingData)).toBe(false)
    expect(mockCreateSplitInvoiceNumber).not.toHaveBeenCalled()
  })

  test('returns false when the invoice matches neither split transform', () => {
    mockCreateSplitInvoiceNumber.mockReturnValue(null)

    const event = {
      type: PAYMENT_PROCESSED,
      data: { invoiceNumber: 'INV123456CV01' }
    }
    const existingData = {
      invoiceNumber: 'INV123456V001',
      sourceSystem: 'FPTT'
    }

    expect(isNewSplitInvoiceNumber(event, existingData)).toBe(false)
  })

  test('returns false when the event type is not PAYMENT_PROCESSED', () => {
    const event = {
      type: 'SOME_OTHER_TYPE',
      data: { invoiceNumber: 'INV123456AV01' }
    }
    const existingData = {
      invoiceNumber: 'INV123456V001',
      sourceSystem: 'FPTT'
    }

    expect(isNewSplitInvoiceNumber(event, existingData)).toBe(false)
    expect(mockCreateSplitInvoiceNumber).not.toHaveBeenCalled()
  })
})

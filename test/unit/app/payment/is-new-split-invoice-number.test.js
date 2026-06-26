const { PAYMENT_PROCESSED } = require('../../../../app/constants/events')
const { FPTT, SFI } = require('../../../../app/constants/source-systems')

jest.mock('../../../../app/payment/create-split-invoice-number')

const createSplitInvoiceNumber = require('../../../../app/payment/create-split-invoice-number')
const { isNewSplitInvoiceNumber } = require('../../../../app/payment/is-new-split-invoice-number')

describe('check if new split invoice number', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('returns true when the invoice matches the A split transform for default source', () => {
    createSplitInvoiceNumber.mockImplementation((existingInvoice, splitId) => {
      if (splitId === 'A') {
        return 'INV123456AV01'
      }
      if (splitId === 'B') {
        return 'INV123456BV01'
      }
      return null
    })

    const mockEvent = {
      type: PAYMENT_PROCESSED,
      data: {
        invoiceNumber: 'INV123456AV01'
      }
    }
    const mockExistingData = {
      invoiceNumber: 'INV123456V001',
      sourceSystem: FPTT
    }

    expect(isNewSplitInvoiceNumber(mockEvent, mockExistingData)).toBe(true)
    expect(createSplitInvoiceNumber).toHaveBeenCalledWith('INV123456V001', 'A', FPTT)
  })

  test('returns true when the invoice matches the B split transform for SITI_AGRI source', () => {
    createSplitInvoiceNumber.mockImplementation((existingInvoice, splitId) => {
      if (splitId === 'A') {
        return 'S0000001AABC01'
      }
      if (splitId === 'B') return 'S0000001BABC01'
      return null
    })

    const mockEvent = {
      type: PAYMENT_PROCESSED,
      data: {
        invoiceNumber: 'S0000001BABC01'
      }
    }
    const mockExistingData = {
      invoiceNumber: 'S0000001ABC001',
      sourceSystem: SFI
    }

    expect(isNewSplitInvoiceNumber(mockEvent, mockExistingData)).toBe(true)
    expect(createSplitInvoiceNumber).toHaveBeenCalledWith('S0000001ABC001', 'B', SFI)
  })

  test('returns false when the invoice number is identical to existingData.invoiceNumber', () => {
    const mockEvent = {
      type: PAYMENT_PROCESSED,
      data: {
        invoiceNumber: 'INV123456V001'
      }
    }
    const mockExistingData = {
      invoiceNumber: 'INV123456V001',
      sourceSystem: FPTT
    }

    expect(isNewSplitInvoiceNumber(mockEvent, mockExistingData)).toBe(false)
    expect(createSplitInvoiceNumber).not.toHaveBeenCalled()
  })

  test('returns false when the invoice does not match either transformed A or B value', () => {
    createSplitInvoiceNumber.mockImplementation((existingInvoice, splitId) => {
      if (splitId === 'A') return 'INV123456AV01'
      if (splitId === 'B') return 'INV123456BV01'
      return null
    })

    const mockEvent = {
      type: PAYMENT_PROCESSED,
      data: {
        invoiceNumber: 'INV123456CV01'
      }
    }
    const mockExistingData = {
      invoiceNumber: 'INV123456V001',
      sourceSystem: FPTT
    }

    expect(isNewSplitInvoiceNumber(mockEvent, mockExistingData)).toBe(false)
  })

  test('returns false if the event type is not PAYMENT_PROCESSED', () => {
    const mockEvent = {
      type: 'SOME_OTHER_TYPE',
      data: {
        invoiceNumber: 'INV123456AV01'
      }
    }
    const mockExistingData = {
      invoiceNumber: 'INV123456V001',
      sourceSystem: FPTT
    }

    expect(isNewSplitInvoiceNumber(mockEvent, mockExistingData)).toBe(false)
    expect(createSplitInvoiceNumber).not.toHaveBeenCalled()
  })
})

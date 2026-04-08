const { PAYMENT_PROCESSED } = require('../../../../app/constants/events')
const { isNewSplitInvoiceNumber } = require('../../../../app/payment/is-new-split-invoice-number')

describe('check if new split invoice number', () => {
  test('should return true if the invoice number is new and contains AV', () => {
    const mockEvent = {
      type: PAYMENT_PROCESSED,
      data: {
        invoiceNumber: 'testInvoiceNumberAV'
      }
    }
    const mockExistingData = {
      invoiceNumber: 'existingInvoiceNumber'
    }

    const result = isNewSplitInvoiceNumber(mockEvent, mockExistingData)

    expect(result).toBe(true)
  })

  test('should return true if the invoice number is new and contains BV', () => {
    const mockEvent = {
      type: PAYMENT_PROCESSED,
      data: {
        invoiceNumber: 'testInvoiceNumberBV'
      }
    }
    const mockExistingData = {
      invoiceNumber: 'existingInvoiceNumber'
    }

    const result = isNewSplitInvoiceNumber(mockEvent, mockExistingData)

    expect(result).toBe(true)
  })

  test('should return false if the invoice number is not new', () => {
    const mockEvent = {
      type: PAYMENT_PROCESSED,
      data: {
        invoiceNumber: 'existingInvoiceNumberAV'
      }
    }
    const mockExistingData = {
      invoiceNumber: 'existingInvoiceNumberAV'
    }

    const result = isNewSplitInvoiceNumber(mockEvent, mockExistingData)

    expect(result).toBe(false)
  })

  test('should return false if the invoice number does not contain AV or BV', () => {
    const mockEvent = {
      type: PAYMENT_PROCESSED,
      data: {
        invoiceNumber: 'testInvoiceNumber'
      }
    }
    const mockExistingData = {
      invoiceNumber: 'existingInvoiceNumber'
    }

    const result = isNewSplitInvoiceNumber(mockEvent, mockExistingData)

    expect(result).toBe(false)
  })

  test('should return false if the event type is not PAYMENT_PROCESSED', () => {
    const mockEvent = {
      type: 'SOME_OTHER_TYPE',
      data: {
        invoiceNumber: 'testInvoiceNumberAV'
      }
    }
    const mockExistingData = {
      invoiceNumber: 'existingInvoiceNumber'
    }

    const result = isNewSplitInvoiceNumber(mockEvent, mockExistingData)

    expect(result).toBe(false)
  })
})

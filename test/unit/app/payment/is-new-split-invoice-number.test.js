const { PAYMENT_PROCESSED } = require('../../../../app/constants/events')
const { isNewSplitInvoiceNumber } = require('../../../../app/payment/is-new-split-invoice-number')

describe('check if new split invoice number', () => {
  test('should return true if the invoice number is new', () => {
    const mockEvent = {
      type: PAYMENT_PROCESSED,
      data: {
        originalInvoiceNumber: 'testOriginalInvoiceNumber',
        invoiceNumber: 'testInvoiceNumber'
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
        originalInvoiceNumber: 'testOriginalInvoiceNumber',
        invoiceNumber: 'existingInvoiceNumber'
      }
    }
    const mockExistingData = {
      invoiceNumber: 'existingInvoiceNumber'
    }

    const result = isNewSplitInvoiceNumber(mockEvent, mockExistingData)

    expect(result).toBe(false)
  })
})

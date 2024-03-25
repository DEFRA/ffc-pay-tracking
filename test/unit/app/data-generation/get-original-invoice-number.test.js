const { getOriginalInvoiceNumber } = require('../../../../app/data-generation/get-original-invoice-number')
const { PAYMENT_EXTRACTED } = require('../../../../app/constants/events')

test('getOriginalInvoiceNumber', () => {
  const event1 = { type: PAYMENT_EXTRACTED, data: { invoiceNumber: 'invoice1' } }
  expect(getOriginalInvoiceNumber(event1)).toBe('invoice1')

  const event2 = { type: 'OTHER_EVENT', data: { invoiceNumber: 'invoice2' } }
  expect(getOriginalInvoiceNumber(event2)).toBeNull()
})

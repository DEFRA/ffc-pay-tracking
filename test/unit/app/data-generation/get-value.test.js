const { getValue } = require('../../../../app/data-generation/get-value')
const { PAYMENT_EXTRACTED, PAYMENT_ENRICHED } = require('../../../../app/constants/events')
const { convertToPence } = require('../../../../app/currency-convert')

jest.mock('../../../../app/currency-convert', () => ({
  convertToPence: jest.fn()
}))

test('getValue', () => {
  convertToPence.mockReturnValueOnce(100)
  const event1 = { type: PAYMENT_EXTRACTED, data: { value: '1.00' } }
  expect(getValue(event1)).toBe(100)

  const event2 = { type: PAYMENT_ENRICHED, data: { value: 200 } }
  expect(getValue(event2)).toBe(200)

  const event3 = { type: 'OTHER_EVENT', data: { value: 300 } }
  expect(getValue(event3)).toBeNull()
})

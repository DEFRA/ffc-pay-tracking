const { getSettledValue } = require('../../../../app/data-generation/get-settled-value')
const { PAYMENT_SETTLED } = require('../../../../app/constants/events')

test('getSettledValue', () => {
  const event1 = { type: PAYMENT_SETTLED, data: { settledValue: 100 } }
  expect(getSettledValue(event1)).toBe(100)

  const event2 = { type: 'OTHER_EVENT', data: { settledValue: 200 } }
  expect(getSettledValue(event2)).toBeNull()
})

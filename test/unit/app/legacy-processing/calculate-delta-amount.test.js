const { calculateDeltaAmount } = require('../../../../app/legacy-processing/calculate-delta-amount')

describe('calculateDeltaAmount', () => {
  test.each([
    ['completed request exists returns its value', { completedPaymentRequests: [{ value: 100 }] }, 100],
    ['no completed requests returns null', { completedPaymentRequests: [] }, null],
    ['completed undefined returns null', { completedPaymentRequests: undefined }, null],
    ['completed null returns null', { completedPaymentRequests: null }, null]
  ])('%s', (_, paymentRequest, expected) => {
    expect(calculateDeltaAmount(paymentRequest)).toBe(expected)
  })
})

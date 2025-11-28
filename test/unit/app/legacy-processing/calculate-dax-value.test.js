const { calculateDAXValue } = require('../../../../app/legacy-processing/calculate-dax-value')

describe('calculateDAXValue', () => {
  test.each([
    ['acknowledged completed request returns deltaAmount', { completedPaymentRequests: [{ acknowledged: true, value: 100 }] }, 100],
    ['not acknowledged returns 0', { completedPaymentRequests: [{ acknowledged: false, value: 100 }] }, 0],
    ['no completed requests returns 0', { completedPaymentRequests: [] }, 0],
    ['completed undefined returns 0', { completedPaymentRequests: undefined }, 0],
    ['completed null returns 0', { completedPaymentRequests: null }, 0]
  ])('%s', (_, paymentRequest, expected) => {
    expect(calculateDAXValue(100, paymentRequest)).toBe(expected)
  })
})

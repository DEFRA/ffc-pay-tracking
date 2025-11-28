const { calculateDAXPRN } = require('../../../../app/legacy-processing/calculate-dax-prn')

describe('calculateDAXPRN', () => {
  function buildPaymentRequest (overrides = {}) {
    return {
      paymentRequestNumber: 3,
      ...overrides
    }
  }

  test.each([
    ['acknowledged first completed request returns PRN', buildPaymentRequest({ completedPaymentRequests: [{ acknowledged: true }] }), 3],
    ['first completed request not acknowledged returns 0', buildPaymentRequest({ completedPaymentRequests: [{ acknowledged: false }] }), 0],
    ['no completed payment requests returns 0', buildPaymentRequest({ completedPaymentRequests: [] }), 0],
    ['completedPaymentRequests undefined returns 0', buildPaymentRequest({ completedPaymentRequests: undefined }), 0],
    ['completedPaymentRequests null returns 0', buildPaymentRequest({ completedPaymentRequests: null }), 0]
  ])('%s', (_, paymentRequest, expected) => {
    expect(calculateDAXPRN(paymentRequest)).toBe(expected)
  })
})

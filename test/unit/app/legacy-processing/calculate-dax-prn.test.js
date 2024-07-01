const { calculateDAXPRN } = require('../../../../app/legacy-processing/calculate-dax-prn')

describe('calculate PRN in DAX for migrated data', () => {
  test('should return paymentRequestNumber when the first completed payment request is acknowledged', () => {
    const paymentRequest = {
      completedPaymentRequests: [{ acknowledged: true }],
      paymentRequestNumber: 3
    }
    const relatedPaymentRequests = []
    expect(calculateDAXPRN(paymentRequest, relatedPaymentRequests)).toBe(3)
  })

  test('should return 0 when the first completed payment request is not acknowledged', () => {
    const paymentRequest = {
      completedPaymentRequests: [{ acknowledged: false }],
      paymentRequestNumber: 3
    }
    const relatedPaymentRequests = []
    expect(calculateDAXPRN(paymentRequest, relatedPaymentRequests)).toBe(0)
  })

  test('should return 0 when there are no completed payment requests', () => {
    const paymentRequest = {
      completedPaymentRequests: [],
      paymentRequestNumber: 3
    }
    const relatedPaymentRequests = []
    expect(calculateDAXPRN(paymentRequest, relatedPaymentRequests)).toBe(0)
  })

  test('should return 0 when completedPaymentRequests is undefined', () => {
    const paymentRequest = {
      completedPaymentRequests: undefined,
      paymentRequestNumber: 3
    }
    const relatedPaymentRequests = []
    expect(calculateDAXPRN(paymentRequest, relatedPaymentRequests)).toBe(0)
  })

  test('should return 0 when completedPaymentRequests is null', () => {
    const paymentRequest = {
      completedPaymentRequests: null,
      paymentRequestNumber: 3
    }
    const relatedPaymentRequests = []
    expect(calculateDAXPRN(paymentRequest, relatedPaymentRequests)).toBe(0)
  })
})

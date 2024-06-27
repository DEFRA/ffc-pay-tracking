const { calculateDAXValue } = require('../../../../app/legacy-processing/calculate-dax-value')

describe('calculate value of claim in DAX for migrated data', () => {
  test('should return the value of the completed payment request if it is acknowledged', () => {
    const paymentRequest = {
      completedPaymentRequests: [{ acknowledged: true, value: 100 }]
    }
    expect(calculateDAXValue(paymentRequest)).toBe(100)
  })

  test('should return 0 if the completed payment request is not acknowledged', () => {
    const paymentRequest = {
      completedPaymentRequests: [{ acknowledged: false, value: 100 }]
    }
    expect(calculateDAXValue(paymentRequest)).toBe(0)
  })

  test('should return 0 if there are no completed payment requests', () => {
    const paymentRequest = {
      completedPaymentRequests: []
    }
    expect(calculateDAXValue(paymentRequest)).toBe(0)
  })

  test('should return 0 if completedPaymentRequests is undefined', () => {
    const paymentRequest = {
      completedPaymentRequests: undefined
    }
    expect(calculateDAXValue(paymentRequest)).toBe(0)
  })

  test('should return 0 if completedPaymentRequests is null', () => {
    const paymentRequest = {
      completedPaymentRequests: null
    }
    expect(calculateDAXValue(paymentRequest)).toBe(0)
  })
})

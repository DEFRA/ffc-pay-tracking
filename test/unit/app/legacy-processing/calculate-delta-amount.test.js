const { calculateDeltaAmount } = require('../../../../app/legacy-processing/calculate-delta-amount')

describe('calculate delta amount for migrated data', () => {
  test('should return the value of the completed payment request if it exists', () => {
    const paymentRequest = {
      completedPaymentRequests: [{ value: 100 }]
    }
    expect(calculateDeltaAmount(paymentRequest)).toBe(100)
  })

  test('should return null if there are no completed payment requests', () => {
    const paymentRequest = {
      completedPaymentRequests: []
    }
    expect(calculateDeltaAmount(paymentRequest)).toBeNull()
  })

  test('should return null if completedPaymentRequests is undefined', () => {
    const paymentRequest = {
      completedPaymentRequests: undefined
    }
    expect(calculateDeltaAmount(paymentRequest)).toBeNull()
  })

  test('should return null if completedPaymentRequests is null', () => {
    const paymentRequest = {
      completedPaymentRequests: null
    }
    expect(calculateDeltaAmount(paymentRequest)).toBeNull()
  })
})

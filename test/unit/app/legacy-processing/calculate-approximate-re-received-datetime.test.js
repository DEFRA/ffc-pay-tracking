const { calculateApproximateREReceivedDateTime } = require('../../../../app/legacy-processing/calculate-approximate-re-received-datetime')

describe('calculate an approximate date time received in request editor', () => {
  test('should return the submitted date if debtType is present, completed payment request, and submitted date is before received date', () => {
    const primaryPaymentRequest = { debtType: 'irr', submitted: '2023-01-01T00:00:00Z' }
    const paymentRequest = {
      completedPaymentRequests: [{ debtType: 'irr', submitted: '2023-01-01T00:00:00Z' }],
      received: '2023-01-02T00:00:00Z'
    }
    expect(calculateApproximateREReceivedDateTime(primaryPaymentRequest, paymentRequest)).toBe('2023-01-01T00:00:00Z')
  })

  test('should return the received date if debtType is present, completed payment request and submitted date is after received date', () => {
    const primaryPaymentRequest = { debtType: 'irr', submitted: '2023-01-03T00:00:00Z' }
    const paymentRequest = {
      completedPaymentRequests: [{ debtType: 'irr', submitted: '2023-01-03T00:00:00Z' }],
      received: '2023-01-02T00:00:00Z'
    }
    expect(calculateApproximateREReceivedDateTime(primaryPaymentRequest, paymentRequest)).toBe('2023-01-02T00:00:00Z')
  })

  test('should return the received date if there is a debtType, no completed payment request', () => {
    const paymentRequest = {
      completedPaymentRequests: [],
      received: '2023-01-02T00:00:00Z',
      debtType: 'irr'
    }
    expect(calculateApproximateREReceivedDateTime(paymentRequest, paymentRequest)).toBe('2023-01-02T00:00:00Z')
  })

  test('should return null if there is no debtType and no completed payment requests', () => {
    const paymentRequest = {
      completedPaymentRequests: [],
      received: '2023-01-02T00:00:00Z'
    }
    expect(calculateApproximateREReceivedDateTime(paymentRequest, paymentRequest)).toBeNull()
  })

  test('should return null if there is no debtType and completed payment requests is undefined', () => {
    const paymentRequest = {
      completedPaymentRequests: undefined,
      received: '2023-01-02T00:00:00Z'
    }
    expect(calculateApproximateREReceivedDateTime(paymentRequest, paymentRequest)).toBeNull()
  })

  test('should return null if there is no debtType and completed payment requests is null', () => {
    const paymentRequest = {
      completedPaymentRequests: null,
      received: '2023-01-02T00:00:00Z'
    }
    expect(calculateApproximateREReceivedDateTime(paymentRequest, paymentRequest)).toBeNull()
  })
})

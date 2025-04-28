const { CS, BPS } = require('../../../../app/constants/source-systems')
const { calculateApproximateREReceivedDateTime } = require('../../../../app/legacy-processing/calculate-approximate-re-received-datetime')

describe('calculate an approximate date time received in request editor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return null if PRN is less than 2', () => {
    const primaryPaymentRequest = { debtType: 'irr', submitted: '2023-01-01T00:00:00Z', paymentRequestNumber: 1 }
    const paymentRequest = {
      completedPaymentRequests: [primaryPaymentRequest],
      received: '2023-01-02T00:00:00Z'
    }
    expect(calculateApproximateREReceivedDateTime(primaryPaymentRequest, paymentRequest)).toBe(null)
  })

  test('should return null if sourceSystem is CS', () => {
    const primaryPaymentRequest = { debtType: 'irr', submitted: '2023-01-01T00:00:00Z', paymentRequestNumber: 2, sourceSystem: CS }
    const paymentRequest = {
      completedPaymentRequests: [primaryPaymentRequest],
      received: '2023-01-02T00:00:00Z'
    }
    expect(calculateApproximateREReceivedDateTime(primaryPaymentRequest, paymentRequest)).toBe(null)
  })

  test('should return null if sourceSystem is BPS', () => {
    const primaryPaymentRequest = { debtType: 'irr', submitted: '2023-01-01T00:00:00Z', paymentRequestNumber: 2, sourceSystem: BPS }
    const paymentRequest = {
      completedPaymentRequests: [primaryPaymentRequest],
      received: '2023-01-02T00:00:00Z'
    }
    expect(calculateApproximateREReceivedDateTime(primaryPaymentRequest, paymentRequest)).toBe(null)
  })

  test('should return the submitted date if debtType is present, completed payment request exists, and submitted date is before received date', () => {
    const primaryPaymentRequest = { debtType: 'irr', submitted: '2023-01-01T00:00:00Z', paymentRequestNumber: 2 }
    const paymentRequest = {
      completedPaymentRequests: [{ debtType: 'irr', submitted: '2023-01-01T00:00:00Z' }],
      received: '2023-01-02T00:00:00Z'
    }
    expect(calculateApproximateREReceivedDateTime(primaryPaymentRequest, paymentRequest)).toBe('2023-01-01T00:00:00Z')
  })

  test('should return the received date if debtType is present, completed payment request exists, and submitted date is after received date', () => {
    const primaryPaymentRequest = { debtType: 'irr', submitted: '2023-01-03T00:00:00Z', paymentRequestNumber: 2 }
    const paymentRequest = {
      completedPaymentRequests: [{ debtType: 'irr', submitted: '2023-01-03T00:00:00Z' }],
      received: '2023-01-02T00:00:00Z'
    }
    expect(calculateApproximateREReceivedDateTime(primaryPaymentRequest, paymentRequest)).toBe('2023-01-02T00:00:00Z')
  })

  test('should return the received date if there is a debtType and no completed payment request', () => {
    const primaryPaymentRequest = { debtType: 'irr', paymentRequestNumber: 2 }
    const paymentRequest = {
      completedPaymentRequests: [],
      received: '2023-01-02T00:00:00Z'
    }
    expect(calculateApproximateREReceivedDateTime(primaryPaymentRequest, paymentRequest)).toBe('2023-01-02T00:00:00Z')
  })

  test('should return the received date if there is no debtType and no completed payment requests', () => {
    const primaryPaymentRequest = { paymentRequestNumber: 2 }
    const paymentRequest = {
      completedPaymentRequests: [],
      received: '2023-01-02T00:00:00Z'
    }
    expect(calculateApproximateREReceivedDateTime(primaryPaymentRequest, paymentRequest)).toBe('2023-01-02T00:00:00Z')
  })

  test('should return the received date if there is no debtType and completed payment requests is undefined', () => {
    const primaryPaymentRequest = { paymentRequestNumber: 2 }
    const paymentRequest = {
      completedPaymentRequests: undefined,
      received: '2023-01-02T00:00:00Z'
    }
    expect(calculateApproximateREReceivedDateTime(primaryPaymentRequest, paymentRequest)).toBe('2023-01-02T00:00:00Z')
  })

  test('should return the received date if there is no debtType and completed payment requests is null', () => {
    const primaryPaymentRequest = { paymentRequestNumber: 2 }
    const paymentRequest = {
      completedPaymentRequests: null,
      received: '2023-01-02T00:00:00Z'
    }
    expect(calculateApproximateREReceivedDateTime(primaryPaymentRequest, paymentRequest)).toBe('2023-01-02T00:00:00Z')
  })
})

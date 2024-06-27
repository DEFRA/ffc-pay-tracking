const { getLastUpdatedDate } = require('../../../../app/legacy-processing/get-last-updated-date')

describe('get last update for migrated data', () => {
  test('should return lastSettlement if available in completedPaymentRequests', () => {
    const paymentRequest = {
      completedPaymentRequests: [{ lastSettlement: '2023-01-01', submitted: '2022-12-01' }],
      received: '2022-11-01'
    }
    expect(getLastUpdatedDate(paymentRequest)).toBe('2023-01-01')
  })

  test('should return submitted if lastSettlement is not available in completedPaymentRequests', () => {
    const paymentRequest = {
      completedPaymentRequests: [{ submitted: '2022-12-01' }],
      received: '2022-11-01'
    }
    expect(getLastUpdatedDate(paymentRequest)).toBe('2022-12-01')
  })

  test('should return received if completedPaymentRequests is empty', () => {
    const paymentRequest = {
      completedPaymentRequests: [],
      received: '2022-11-01'
    }
    expect(getLastUpdatedDate(paymentRequest)).toBe('2022-11-01')
  })

  test('should return received if completedPaymentRequests is undefined', () => {
    const paymentRequest = {
      received: '2022-11-01'
    }
    expect(getLastUpdatedDate(paymentRequest)).toBe('2022-11-01')
  })

  test('should return received if completedPaymentRequests is null', () => {
    const paymentRequest = {
      completedPaymentRequests: null,
      received: '2022-11-01'
    }
    expect(getLastUpdatedDate(paymentRequest)).toBe('2022-11-01')
  })
})

const { getStatus } = require('../../../../app/legacy-processing/get-status')

describe('get status for migrated data', () => {
  test('should return "Settled by payment ledger" when the completed payment request has ledger "AP" and settled value', () => {
    const paymentRequest = {
      completedPaymentRequests: [{ ledger: 'AP', settledValue: 100 }]
    }
    expect(getStatus(paymentRequest)).toBe('Settled by payment ledger')
  })

  test('should return "Acknowledged by payment ledger" when the completed payment request is acknowledged', () => {
    const paymentRequest = {
      completedPaymentRequests: [{ acknowledged: true }]
    }
    expect(getStatus(paymentRequest)).toBe('Acknowledged by payment ledger')
  })

  test('should return "Submitted to payment ledger" when there is a completed payment request', () => {
    const paymentRequest = {
      completedPaymentRequests: [{}]
    }
    expect(getStatus(paymentRequest)).toBe('Submitted to payment ledger')
  })

  test('should return "Waiting for ledger assignment" when there are no completed payment requests but there is a debt type', () => {
    const paymentRequest = {
      completedPaymentRequests: [],
      debtType: 'someDebtType'
    }
    expect(getStatus(paymentRequest)).toBe('Waiting for ledger assignment')
  })

  test('should return "Waiting for debt data" when there are no completed payment requests and no debt type', () => {
    const paymentRequest = {
      completedPaymentRequests: []
    }
    expect(getStatus(paymentRequest)).toBe('Waiting for debt data')
  })

  test('should return "Waiting for debt data" when paymentRequest is an empty object', () => {
    const paymentRequest = {}
    expect(getStatus(paymentRequest)).toBe('Waiting for debt data')
  })

  test('should return "Waiting for debt data" when completedPaymentRequests is undefined', () => {
    const paymentRequest = {
      completedPaymentRequests: undefined
    }
    expect(getStatus(paymentRequest)).toBe('Waiting for debt data')
  })

  test('should return "Waiting for debt data" when completedPaymentRequests is null', () => {
    const paymentRequest = {
      completedPaymentRequests: null
    }
    expect(getStatus(paymentRequest)).toBe('Waiting for debt data')
  })
})

const { getStatusDaxImported } = require('../../../../app/legacy-processing/get-status-dax-imported')

describe('get status for migrated data', () => {
  test('should return status as "Settled by payment ledger" and daxImported as "Y" when the completed payment request has ledger "AP" and settled value', () => {
    const paymentRequest = {
      completedPaymentRequests: [{ ledger: 'AP', settledValue: 100 }]
    }
    const result = getStatusDaxImported(paymentRequest)
    expect(result.status).toBe('Settled by payment ledger')
    expect(result.daxImported).toBe('Y')
  })

  test('should return status as "Acknowledged by payment ledger" and daxImported as "Y" when the completed payment request is acknowledged', () => {
    const paymentRequest = {
      completedPaymentRequests: [{ acknowledged: true }]
    }
    const result = getStatusDaxImported(paymentRequest)
    expect(result.status).toBe('Acknowledged by payment ledger')
    expect(result.daxImported).toBe('Y')
  })

  test('should return status as "Submitted to payment ledger" when there is a completed payment request', () => {
    const paymentRequest = {
      completedPaymentRequests: [{}]
    }
    const result = getStatusDaxImported(paymentRequest)
    expect(result.status).toBe('Submitted to payment ledger')
    expect(result.daxImported).toBe(null)
  })

  test('should return status as "Waiting for ledger assignment" when there are no completed payment requests but there is a debt type', () => {
    const paymentRequest = {
      completedPaymentRequests: [],
      debtType: 'someDebtType'
    }
    const result = getStatusDaxImported(paymentRequest)
    expect(result.status).toBe('Waiting for ledger assignment')
    expect(result.daxImported).toBe(null)
  })

  test('should return status as "Waiting for debt data" when there are no completed payment requests and no debt type', () => {
    const paymentRequest = {
      completedPaymentRequests: []
    }
    const result = getStatusDaxImported(paymentRequest)
    expect(result.status).toBe('Waiting for debt data')
    expect(result.daxImported).toBe(null)
  })

  test('should return status as "Waiting for debt data" and daxImported as null when paymentRequest is an empty object', () => {
    const paymentRequest = {}
    const result = getStatusDaxImported(paymentRequest)
    expect(result.status).toBe('Waiting for debt data')
    expect(result.daxImported).toBe(null)
  })

  test('should return status as "Waiting for debt data" and daxImported as null when completedPaymentRequests is undefined', () => {
    const paymentRequest = {
      completedPaymentRequests: undefined
    }
    const result = getStatusDaxImported(paymentRequest)
    expect(result.status).toBe('Waiting for debt data')
    expect(result.daxImported).toBe(null)
  })

  test('should return status as "Waiting for debt data" and daxImported as null when completedPaymentRequests is null', () => {
    const paymentRequest = {
      completedPaymentRequests: null
    }
    const result = getStatusDaxImported(paymentRequest)
    expect(result.status).toBe('Waiting for debt data')
    expect(result.daxImported).toBe(null)
  })
})

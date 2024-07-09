const { AP, AR } = require('../../../../app/constants/ledgers')
const { calculateLedgerValue } = require('../../../../app/legacy-processing/calculate-ledger-value')

describe('calculate ledger (AP or AR) value for migrated data', () => {
  test('should return the value of the first completed payment request if its ledger matches', () => {
    const paymentRequest = {
      completedPaymentRequests: [{ ledger: AP, value: '100' }]
    }
    expect(calculateLedgerValue(paymentRequest, AP)).toBe(100)
  })

  test('should return 0 if the ledger of the first completed payment request does not match', () => {
    const paymentRequest = {
      completedPaymentRequests: [{ ledger: AR, value: '200' }]
    }
    expect(calculateLedgerValue(paymentRequest, AP)).toBe(0)
  })

  test('should return 0 if there are no completed payment requests', () => {
    const paymentRequest = {
      completedPaymentRequests: []
    }
    expect(calculateLedgerValue(paymentRequest, AP)).toBe(0)
  })

  test('should return 0 if completedPaymentRequests is undefined', () => {
    const paymentRequest = {
      completedPaymentRequests: undefined
    }
    expect(calculateLedgerValue(paymentRequest, AP)).toBe(0)
  })

  test('should return 0 if completedPaymentRequests is null', () => {
    const paymentRequest = {
      completedPaymentRequests: null
    }
    expect(calculateLedgerValue(paymentRequest, AP)).toBe(0)
  })
})

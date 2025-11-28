const { AP, AR } = require('../../../../app/constants/ledgers')
const { calculateLedgerValue } = require('../../../../app/legacy-processing/calculate-ledger-value')

describe('calculateLedgerValue', () => {
  test.each([
    ['first completed request ledger matches returns value', { completedPaymentRequests: [{ ledger: AP, value: '100' }] }, AP, 100],
    ['ledger does not match returns 0', { completedPaymentRequests: [{ ledger: AR, value: '200' }] }, AP, 0],
    ['no completed requests returns 0', { completedPaymentRequests: [] }, AP, 0],
    ['completed undefined returns 0', { completedPaymentRequests: undefined }, AP, 0],
    ['completed null returns 0', { completedPaymentRequests: null }, AP, 0]
  ])('%s', (_, paymentRequest, ledger, expected) => {
    expect(calculateLedgerValue(paymentRequest, ledger)).toBe(expected)
  })
})

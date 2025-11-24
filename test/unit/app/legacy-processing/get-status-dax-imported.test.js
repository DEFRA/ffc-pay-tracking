const { getStatusDaxImported } = require('../../../../app/legacy-processing/get-status-dax-imported')

describe('getStatusDaxImported', () => {
  test.each([
    [
      'ledger AP with settledValue returns Settled by payment ledger / Y',
      { completedPaymentRequests: [{ ledger: 'AP', settledValue: 100 }] },
      { status: 'Settled by payment ledger', daxImported: 'Y' }
    ],
    [
      'acknowledged completed request returns Acknowledged by payment ledger / Y',
      { completedPaymentRequests: [{ acknowledged: true }] },
      { status: 'Acknowledged by payment ledger', daxImported: 'Y' }
    ],
    [
      'completed request exists returns Submitted to payment ledger / null',
      { completedPaymentRequests: [{}] },
      { status: 'Submitted to payment ledger', daxImported: null }
    ],
    [
      'no completed requests but has debtType returns Waiting for ledger assignment / null',
      { completedPaymentRequests: [], debtType: 'someDebtType' },
      { status: 'Waiting for ledger assignment', daxImported: null }
    ],
    [
      'no completed requests and no debtType returns Waiting for debt data / null',
      { completedPaymentRequests: [] },
      { status: 'Waiting for debt data', daxImported: null }
    ],
    [
      'empty object returns Waiting for debt data / null',
      {},
      { status: 'Waiting for debt data', daxImported: null }
    ],
    [
      'completedPaymentRequests undefined returns Waiting for debt data / null',
      { completedPaymentRequests: undefined },
      { status: 'Waiting for debt data', daxImported: null }
    ],
    [
      'completedPaymentRequests null returns Waiting for debt data / null',
      { completedPaymentRequests: null },
      { status: 'Waiting for debt data', daxImported: null }
    ]
  ])('%s', (_, paymentRequest, expected) => {
    const result = getStatusDaxImported(paymentRequest)
    expect(result).toEqual(expected)
  })
})

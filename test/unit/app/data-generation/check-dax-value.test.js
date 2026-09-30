const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['reportData'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))
const { PAYMENT_ACKNOWLEDGED_STATUS, PAYMENT_SETTLED_STATUS, PAYMENT_ENRICHED_STATUS } = require('../../../../app/constants/statuses')
const { getDataFilter } = require('../../../../app/helpers/get-data-filter')
const { getStatus } = require('../../../../app/data-generation/get-status')
const { getDeltaAmount } = require('../../../../app/data-generation/get-delta-amount')
const { checkDAXValue } = require('../../../../app/data-generation/check-dax-value')

jest.mock('../../../../app/helpers/get-data-filter')
jest.mock('../../../../app/data-generation/get-status')
jest.mock('../../../../app/data-generation/get-delta-amount')

describe('check value imported to DAX', () => {
  let event, transaction

  beforeEach(() => {
    event = {
      data: {
        paymentRequestNumber: 3
      }
    }
    transaction = mockDb.trx
    jest.clearAllMocks()
    mockDb.builder.resolves([])
    getDataFilter.mockReturnValue({ filter: 'filterValue' })
    getStatus.mockReturnValue(PAYMENT_SETTLED_STATUS)
    getDeltaAmount.mockResolvedValue(100)
  })

  test('returns 0 when there are no previous requests and current request is not acknowledged or settled', async () => {
    getStatus.mockReturnValue(PAYMENT_ENRICHED_STATUS)
    const result = await checkDAXValue(event, transaction)
    expect(result).toBe(0)
  })

  test('returns the delta value when there are no previous requests and current is acknowledged or settled', async () => {
    const result = await checkDAXValue(event, transaction)
    expect(result).toBe(100)
  })

  test('returns the correct value when previous requests exist with acknowledged or settled status', async () => {
    mockDb.builder.resolves([
      { status: PAYMENT_ACKNOWLEDGED_STATUS, paymentRequestNumber: 1, deltaAmount: 50 },
      { status: PAYMENT_SETTLED_STATUS, paymentRequestNumber: 2, deltaAmount: 30 }
    ])

    const result = await checkDAXValue(event, transaction)
    expect(result).toBe(180)
  })

  test('ignores previous requests with non-acknowledged or settled status', async () => {
    mockDb.builder.resolves([
      { status: PAYMENT_ENRICHED_STATUS, paymentRequestNumber: 1, deltaAmount: 50 },
      { status: PAYMENT_SETTLED_STATUS, paymentRequestNumber: 2, deltaAmount: 30 }
    ])

    const result = await checkDAXValue(event, transaction)
    expect(result).toBe(130)
  })

  test('returns previous total value when previous requests exist with acknowledged or settled status, current is not', async () => {
    getStatus.mockReturnValue(PAYMENT_ENRICHED_STATUS)
    mockDb.builder.resolves([
      { status: PAYMENT_ACKNOWLEDGED_STATUS, paymentRequestNumber: 1, deltaAmount: 50 },
      { status: PAYMENT_SETTLED_STATUS, paymentRequestNumber: 2, deltaAmount: 30 }
    ])

    const result = await checkDAXValue(event, transaction)
    expect(result).toBe(80)
  })

  test('does not duplicate the delta amount for the current request if already added', async () => {
    mockDb.builder.resolves([
      { status: PAYMENT_ACKNOWLEDGED_STATUS, paymentRequestNumber: 3, deltaAmount: 100 }
    ])
    getStatus.mockReturnValue(PAYMENT_SETTLED_STATUS)

    const result = await checkDAXValue(event, transaction)
    expect(result).toBe(100)
  })

  test('queries the transaction without the paymentRequestNumber filter', async () => {
    getDataFilter.mockReturnValue({ filter: 'filterValue', paymentRequestNumber: 3 })

    await checkDAXValue(event, transaction)

    expect(mockDb.tables.reportData).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ filter: 'filterValue' })
  })

  test('queries the pool when no transaction is supplied', async () => {
    await checkDAXValue(event)

    expect(mockDb.tables.reportData).toHaveBeenCalledWith(undefined)
  })
})

const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['reportData'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))
const {
  PAYMENT_ACKNOWLEDGED_STATUS,
  PAYMENT_SETTLED_STATUS,
  PAYMENT_ENRICHED_STATUS
} = require('../../../../app/constants/statuses')
const { getDataFilter } = require('../../../../app/helpers/get-data-filter')
const { getStatus } = require('../../../../app/data-generation/get-status')
const { checkDAXPRN } = require('../../../../app/data-generation/check-dax-prn')

jest.mock('../../../../app/helpers/get-data-filter')
jest.mock('../../../../app/data-generation/get-status')

describe('check PRN imported to DAX', () => {
  let event
  let transaction

  beforeEach(() => {
    event = { data: { paymentRequestNumber: 3 } }
    transaction = mockDb.trx
    jest.clearAllMocks()
    getDataFilter.mockReturnValue({ filter: 'filterValue' })
  })

  const cases = [
    {
      name: 'previous acknowledged paymentRequestNumber',
      status: PAYMENT_ENRICHED_STATUS,
      dbResults: [
        { status: PAYMENT_ENRICHED_STATUS },
        { status: PAYMENT_ACKNOWLEDGED_STATUS, paymentRequestNumber: 1 }
      ],
      expected: 1
    },
    {
      name: 'previous settled paymentRequestNumber',
      status: 'OTHER_STATUS',
      dbResults: [
        { status: PAYMENT_ENRICHED_STATUS },
        { status: PAYMENT_SETTLED_STATUS, paymentRequestNumber: 1 }
      ],
      expected: 1
    },
    {
      name: '0 when no acknowledged or settled result exists',
      status: PAYMENT_ENRICHED_STATUS,
      dbResults: [],
      expected: 0
    }
  ]

  test.each(cases)('returns $expected for $name', async ({ status, dbResults, expected }) => {
    getStatus.mockReturnValue(status)
    mockDb.builder.resolves(dbResults)

    const result = await checkDAXPRN(event, transaction)
    expect(result).toBe(expected)
  })

  test('queries previous requests newest first, up to the current request number', async () => {
    getStatus.mockReturnValue(PAYMENT_ENRICHED_STATUS)
    mockDb.builder.resolves([])

    await checkDAXPRN(event, transaction)

    expect(mockDb.tables.reportData).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ filter: 'filterValue' })
    expect(mockDb.builder.where).toHaveBeenCalledWith('paymentRequestNumber', '<=', 3)
    expect(mockDb.builder.orderBy).toHaveBeenCalledWith('paymentRequestNumber', 'desc')
  })

  test('queries the pool when no transaction is supplied', async () => {
    getStatus.mockReturnValue(PAYMENT_ENRICHED_STATUS)
    mockDb.builder.resolves([])

    await checkDAXPRN(event)

    expect(mockDb.tables.reportData).toHaveBeenCalledWith(undefined)
  })

  test('returns the current request number without querying when already acknowledged', async () => {
    getStatus.mockReturnValue(PAYMENT_ACKNOWLEDGED_STATUS)

    const result = await checkDAXPRN(event, transaction)

    expect(result).toBe(3)
    expect(mockDb.tables.reportData).not.toHaveBeenCalled()
  })
})

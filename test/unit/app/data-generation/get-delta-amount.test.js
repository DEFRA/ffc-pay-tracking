const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['reportData'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { getDeltaAmount } = require('../../../../app/data-generation/get-delta-amount')
const { PAYMENT_PROCESSED, PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../../../../app/constants/events')
const { getValue } = require('../../../../app/data-generation')
const { getDataFilter } = require('../../../../app/helpers/get-data-filter')

jest.mock('../../../../app/data-generation/get-value')
jest.mock('../../../../app/helpers/get-data-filter')

describe('check delta amount', () => {
  beforeEach(() => {
    getValue.mockReturnValue(100)
    getDataFilter.mockReturnValue({
      paymentRequestNumber: 1,
      sourceSystem: 'system1',
      frn: 'frn1',
      agreementNumber: 'agreement1'
    })
    jest.clearAllMocks()
    mockDb.builder.resolves({ value: 50 })
  })

  test('getDeltaAmount returns event data value for processed event types', async () => {
    const eventTypes = [PAYMENT_PROCESSED, PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED]

    for (const type of eventTypes) {
      const event = { type, data: { value: 200 } }
      const transaction = {}

      const result = await getDeltaAmount(event, transaction)

      expect(result).toBe(200)
    }
  })

  test('getDeltaAmount returns output of getValue when requestNumber is 0', async () => {
    const event = { data: { paymentRequestNumber: 0, value: 150 } }
    const transaction = {}

    const result = await getDeltaAmount(event, transaction)

    expect(result).toBe(100)
  })

  test('getDeltaAmount returns output of getValue when it returns null', async () => {
    getValue.mockReturnValue(null)
    const event = { data: { paymentRequestNumber: 0, value: 150 } }
    const transaction = {}

    const result = await getDeltaAmount(event, transaction)

    expect(result).toBeNull()
  })

  test('getDeltaAmount calculates delta amount', async () => {
    const event = { data: { paymentRequestNumber: 2, sourceSystem: 'system1', frn: 'frn1', agreementNumber: 'agreement1' } }
    const transaction = {}

    const result = await getDeltaAmount(event, transaction)

    expect(result).toBe(50)
    expect(mockDb.tables.reportData).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({
      paymentRequestNumber: 1,
      sourceSystem: 'system1',
      frn: 'frn1',
      agreementNumber: 'agreement1'
    })
  })

  test('getDeltaAmount queries the pool when no transaction is supplied', async () => {
    const event = { data: { paymentRequestNumber: 2 } }

    await getDeltaAmount(event)

    expect(mockDb.tables.reportData).toHaveBeenCalledWith(undefined)
  })

  test('getDeltaAmount returns value when no matching database entry is found', async () => {
    mockDb.builder.resolves(undefined)

    const event = { data: { paymentRequestNumber: 2, sourceSystem: 'system1', frn: 'frn1', agreementNumber: 'agreement1' } }
    const transaction = {}

    const result = await getDeltaAmount(event, transaction)

    expect(result).toBe(100)
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
  })
})

const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['reportData'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

jest.mock('../../../../app/helpers/get-data-filter', () => ({
  getDataFilter: jest.fn()
}))
const { getDataFilter } = require('../../../../app/helpers/get-data-filter')

const { getExistingDataFull } = require('../../../../app/helpers/get-existing-data-full')

describe('getExistingDataFull', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('should return null if paymentRequestNumber is undefined', async () => {
    const result = await getExistingDataFull({ correlationId: 'corr-1' }, mockDb.trx)
    expect(result).toBeNull()
    expect(getDataFilter).not.toHaveBeenCalled()
    expect(mockDb.tables.reportData).not.toHaveBeenCalled()
  })

  test('should return null if paymentRequestNumber is null', async () => {
    const result = await getExistingDataFull({ paymentRequestNumber: null, correlationId: 'corr-1' }, mockDb.trx)
    expect(result).toBeNull()
    expect(getDataFilter).not.toHaveBeenCalled()
    expect(mockDb.tables.reportData).not.toHaveBeenCalled()
  })

  test('should query the transaction with the data filter and correlationId', async () => {
    const data = { paymentRequestNumber: 123, correlationId: 'corr-1' }
    getDataFilter.mockReturnValue({ someKey: 'someValue' })
    const row = { id: 1, data: 'some data' }
    mockDb.builder.resolves(row)

    const result = await getExistingDataFull(data, mockDb.trx)

    expect(getDataFilter).toHaveBeenCalledWith(data)
    expect(mockDb.tables.reportData).toHaveBeenCalledWith(mockDb.trx)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ someKey: 'someValue', correlationId: 'corr-1' })
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
    expect(result).toBe(row)
  })

  test('should work when paymentRequestNumber is 0 (falsy but valid)', async () => {
    getDataFilter.mockReturnValue({ key: 'value' })
    const row = { id: 2 }
    mockDb.builder.resolves(row)

    const result = await getExistingDataFull({ paymentRequestNumber: 0, correlationId: 'corr-2' }, mockDb.trx)

    expect(mockDb.builder.where).toHaveBeenCalledWith({ key: 'value', correlationId: 'corr-2' })
    expect(result).toBe(row)
  })

  test('should query the pool and return null when no transaction and no row', async () => {
    getDataFilter.mockReturnValue({})

    const result = await getExistingDataFull({ paymentRequestNumber: 1, correlationId: 'corr-3' })

    expect(mockDb.tables.reportData).toHaveBeenCalledWith(undefined)
    expect(result).toBeNull()
  })
})

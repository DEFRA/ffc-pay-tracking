const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['reportData'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { getExistingDataPartial } = require('../../../../app/payment/get-existing-data-partial')

describe('getExistingDataPartial', () => {
  const mockData = {
    value: 'testValue',
    batchExportDate: 'testBatchExportDate',
    originalInvoiceNumber: 'testOriginalInvoiceNumber',
    deltaAmount: 'testDeltaAmount'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(mockData)
  })

  test('should retrieve the existing data with a row lock inside the transaction', async () => {
    const data = await getExistingDataPartial('testCorrelationId', mockDb.trx)

    expect(mockDb.tables.reportData).toHaveBeenCalledWith(mockDb.trx)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ correlationId: 'testCorrelationId' })
    expect(mockDb.builder.forUpdate).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
    expect(data).toEqual(mockData)
  })

  test('should query the pool when no transaction is supplied', async () => {
    await getExistingDataPartial('testCorrelationId')

    expect(mockDb.tables.reportData).toHaveBeenCalledWith(undefined)
  })

  test('should query the pool when the transaction is null', async () => {
    await getExistingDataPartial('testCorrelationId', null)

    expect(mockDb.tables.reportData).toHaveBeenCalledWith(undefined)
  })

  test('should return null when no row is found', async () => {
    mockDb.builder.resolves(undefined)

    const data = await getExistingDataPartial('testCorrelationId', mockDb.trx)

    expect(data).toBeNull()
  })
})

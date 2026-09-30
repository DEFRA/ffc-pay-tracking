const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['reportData'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeReportData } = require('../../../../app/retention/remove-report-data')

describe('removeReportData', () => {
  const agreementNumber = 'AGR123'
  const frn = 456789
  const sourceSystem = 'Source system'

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('deletes matching rows inside the transaction', async () => {
    await removeReportData(agreementNumber, frn, sourceSystem, mockDb.trx)

    expect(mockDb.tables.reportData).toHaveBeenCalledWith(mockDb.trx)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ agreementNumber, frn, sourceSystem })
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('deletes against the pool if no transaction is provided', async () => {
    await removeReportData(agreementNumber, frn, sourceSystem)

    expect(mockDb.tables.reportData).toHaveBeenCalledWith(undefined)
  })

  test('propagates errors from the delete', async () => {
    mockDb.builder.rejects(new Error('DB failure'))

    await expect(removeReportData(agreementNumber, frn, sourceSystem, mockDb.trx)).rejects.toThrow('DB failure')
  })
})

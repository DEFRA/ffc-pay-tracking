const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['reportData'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { updateExistingRecord } = require('../../../../app/payment/update-existing-record')

describe('update existing record', () => {
  const baseData = {
    status: 'PROCESSED',
    apValue: 100,
    arValue: 50,
    daxFileName: 'test_AP_file.csv',
    daxImported: true,
    settledValue: 150,
    daxPaymentRequestNumber: 'PR123',
    daxValue: 100,
    overallStatus: 'COMPLETE',
    valueStillToProcess: 0,
    prStillToProcess: 0,
    lastUpdated: '2026-01-29'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('should update record with all valid data', async () => {
    await updateExistingRecord(baseData, 'INV123', mockDb.trx)

    expect(mockDb.tables.reportData).toHaveBeenCalledWith(mockDb.trx)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ invoiceNumber: 'INV123' })
    expect(mockDb.builder.update).toHaveBeenCalledWith({ ...baseData, ledgerSplit: 'Y' })
  })

  test('should exclude daxFileName if it does not contain _AP_', async () => {
    await updateExistingRecord({ ...baseData, daxFileName: 'test_file.csv' }, 'INV123', mockDb.trx)

    const { daxFileName, ...expected } = baseData
    expect(mockDb.builder.update).toHaveBeenCalledWith({ ...expected, ledgerSplit: 'Y' })
  })

  test('should remove null and undefined values from update data', async () => {
    await updateExistingRecord({
      ...baseData,
      arValue: null,
      daxFileName: undefined,
      daxPaymentRequestNumber: null,
      prStillToProcess: undefined
    }, 'INV123', mockDb.trx)

    expect(mockDb.builder.update).toHaveBeenCalledWith({
      status: 'PROCESSED',
      apValue: 100,
      daxImported: true,
      settledValue: 150,
      ledgerSplit: 'Y',
      daxValue: 100,
      overallStatus: 'COMPLETE',
      valueStillToProcess: 0,
      lastUpdated: '2026-01-29'
    })
  })

  test('should always set ledgerSplit to Y', async () => {
    await updateExistingRecord(baseData, 'INV123', mockDb.trx)

    expect(mockDb.builder.update.mock.calls[0][0].ledgerSplit).toBe('Y')
  })

  test('should update against the pool when no transaction is supplied', async () => {
    await updateExistingRecord(baseData, 'INV123')

    expect(mockDb.tables.reportData).toHaveBeenCalledWith(undefined)
  })
})

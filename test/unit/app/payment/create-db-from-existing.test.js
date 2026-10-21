const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['reportData'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { createDBFromExisting } = require('../../../../app/payment/create-db-from-existing')

describe('create a new database entry from existing related data', () => {
  const mockData = {
    value: 'testValue',
    batch: 'testBatchName',
    batchExportDate: 'testBatchExportDate',
    originalInvoiceNumber: 'testOriginalInvoiceNumber',
    deltaAmount: 'testDeltaAmount'
  }
  const mockExistingData = {
    value: 'existingValue',
    batch: 'existingBatchName',
    batchExportDate: 'existingBatchExportDate',
    originalInvoiceNumber: 'existingOriginalInvoiceNumber',
    deltaAmount: 'existingDeltaAmount',
    routedToRequestEditor: 'existingRouted',
    receivedInRequestEditor: 'existingReceived',
    releasedFromRequestEditor: 'existingReleased',
    enriched: 'existingEnriched'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('should create a new database entry with the existing data', async () => {
    await createDBFromExisting({ ...mockData }, mockExistingData, mockDb.trx)

    expect(mockDb.tables.reportData).toHaveBeenCalledWith(mockDb.trx)
    expect(mockDb.builder.insert).toHaveBeenCalledWith({
      value: 'existingValue',
      batch: 'existingBatchName',
      batchExportDate: 'existingBatchExportDate',
      originalInvoiceNumber: 'existingOriginalInvoiceNumber',
      deltaAmount: 'existingDeltaAmount',
      routedToRequestEditor: 'existingRouted',
      receivedInRequestEditor: 'existingReceived',
      releasedFromRequestEditor: 'existingReleased',
      enriched: 'existingEnriched',
      ledgerSplit: 'Y'
    })
  })

  test('should only insert columns that exist on the table', async () => {
    await createDBFromExisting({ ...mockData, type: 'not-a-column', actions: [] }, mockExistingData, mockDb.trx)

    const inserted = mockDb.builder.insert.mock.calls[0][0]
    expect(inserted).not.toHaveProperty('type')
    expect(inserted).not.toHaveProperty('actions')
  })

  test('should insert against the pool when no transaction is supplied', async () => {
    await createDBFromExisting({ ...mockData }, mockExistingData)

    expect(mockDb.tables.reportData).toHaveBeenCalledWith(undefined)
  })
})

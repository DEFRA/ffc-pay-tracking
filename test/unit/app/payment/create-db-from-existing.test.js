const db = require('../../../../app/data')
const { createDBFromExisting } = require('../../../../app/payment/create-db-from-existing')

jest.mock('../../../../app/data')

describe('create a new database entry from existing related data', () => {
  test('should create a new database entry with the existing data', async () => {
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
    const mockTransaction = {}

    db.reportData.create.mockResolvedValue()

    await createDBFromExisting(mockData, mockExistingData, mockTransaction)

    expect(db.reportData.create).toHaveBeenCalledWith({
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
    }, { transaction: mockTransaction })
  })
})

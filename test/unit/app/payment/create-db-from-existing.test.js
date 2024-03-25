const db = require('../../../../app/data')
const { createDBFromExisting } = require('../../../../app/payment/create-db-from-existing')

jest.mock('../../../../app/data')

describe('createDBFromExisting', () => {
  test('should create a new database entry with the existing data', async () => {
    const mockData = {
      value: 'testValue',
      batchExportDate: 'testBatchExportDate',
      originalInvoiceNumber: 'testOriginalInvoiceNumber',
      deltaAmount: 'testDeltaAmount'
    }
    const mockExistingData = {
      value: 'existingValue',
      batchExportDate: 'existingBatchExportDate',
      originalInvoiceNumber: 'existingOriginalInvoiceNumber',
      deltaAmount: 'existingDeltaAmount'
    }
    const mockTransaction = {}

    db.reportData.create.mockResolvedValue()

    await createDBFromExisting(mockData, mockExistingData, mockTransaction)

    expect(db.reportData.create).toHaveBeenCalledWith({
      value: 'existingValue',
      batchExportDate: 'existingBatchExportDate',
      originalInvoiceNumber: 'existingOriginalInvoiceNumber',
      deltaAmount: 'existingDeltaAmount'
    }, { transaction: mockTransaction })
  })
})

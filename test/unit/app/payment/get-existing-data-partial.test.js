const db = require('../../../../app/data')
const { getExistingDataPartial } = require('../../../../app/payment/get-existing-data-partial')

jest.mock('../../../../app/data')

describe('getExistingDataPartial', () => {
  test('should retrieve the existing data from the database', async () => {
    const mockCorrelationId = 'testCorrelationId'
    const mockTransaction = {}
    const mockData = {
      value: 'testValue',
      batchExportDate: 'testBatchExportDate',
      originalInvoiceNumber: 'testOriginalInvoiceNumber',
      deltaAmount: 'testDeltaAmount'
    }

    db.reportData.findOne.mockResolvedValue(mockData)

    const data = await getExistingDataPartial(mockCorrelationId, mockTransaction)

    expect(db.reportData.findOne).toHaveBeenCalledWith({
      transaction: mockTransaction,
      lock: true,
      where: {
        correlationId: mockCorrelationId
      }
    })
    expect(data).toEqual(mockData)
  })
})

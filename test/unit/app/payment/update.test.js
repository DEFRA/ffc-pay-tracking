const db = require('../../../../app/data')
const { updatePayment } = require('../../../../app/payment/update')
const { createData } = require('../../../../app/payment/create-data')
jest.mock('../../../../app/data')
jest.mock('../../../../app/payment/create-data')
jest.mock('../../../../app/get-existing-data-full')
jest.mock('../../../../app/payment/is-new-invoice-number')
jest.mock('../../../../app/payment/create-db-from-existing')
jest.mock('../../../../app/get-where-filter')

describe('updatePayment', () => {
  test('should rollback the transaction when an error is thrown', async () => {
    const mockEvent = {
      data: {
        correlationId: 'testCorrelationId',
        sourceSystem: 'testSourceSystem',
        frn: 'testFrn',
        agreementNumber: 'testAgreementNumber',
        originalInvoiceNumber: 'testOriginalInvoiceNumber'
      }
    }
    const mockTransaction = {
      rollback: jest.fn(),
      commit: jest.fn()
    }

    db.sequelize.transaction.mockResolvedValue(mockTransaction)
    createData.mockRejectedValue(new Error('Test error'))

    await expect(updatePayment(mockEvent)).rejects.toThrow('Test error')

    expect(db.sequelize.transaction).toHaveBeenCalled()
    expect(createData).toHaveBeenCalledWith(mockEvent, mockTransaction)
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })
})

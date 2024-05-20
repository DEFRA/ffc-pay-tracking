const db = require('../../../../app/data')
const { createData } = require('../../../../app/payment/create-data')
const { getExistingDataFull } = require('../../../../app/get-existing-data-full')
const { isNewInvoiceNumber } = require('../../../../app/payment/is-new-invoice-number')
const { createDBFromExisting } = require('../../../../app/payment/create-db-from-existing')
const { getWhereFilter } = require('../../../../app/get-where-filter')
const { updateLedgerSplit } = require('../../../../app/payment/update-ledger-split')
const { updatePayment } = require('../../../../app/payment/update')

jest.mock('../../../../app/data')
jest.mock('../../../../app/payment/create-data')
jest.mock('../../../../app/get-existing-data-full')
jest.mock('../../../../app/payment/is-new-invoice-number')
jest.mock('../../../../app/payment/create-db-from-existing')
jest.mock('../../../../app/get-where-filter')
jest.mock('../../../../app/payment/update-ledger-split')

describe('update from a payment message', () => {
  let transaction

  beforeEach(() => {
    transaction = {
      commit: jest.fn(),
      rollback: jest.fn()
    }
    db.sequelize.transaction.mockResolvedValue(transaction)
    db.reportData = {
      destroy: jest.fn(),
      update: jest.fn(),
      create: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should create new report data when there is no existing data', async () => {
    const event = { data: { someData: 'someValue' } }
    const dbData = { id: 1 }
    createData.mockResolvedValue(dbData)
    getExistingDataFull.mockResolvedValue(null)

    await updatePayment(event)

    expect(createData).toHaveBeenCalledWith(event, transaction)
    expect(getExistingDataFull).toHaveBeenCalledWith(event.data, transaction)
    expect(db.reportData.create).toHaveBeenCalledWith({ ...dbData }, { transaction })
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should handle new invoice number case and delete existing report data', async () => {
    const event = { data: { originalInvoiceNumber: '123' } }
    const dbData = { id: 1 }
    const existingData = { invoiceNumber: '456' }
    createData.mockResolvedValue(dbData)
    getExistingDataFull.mockResolvedValue(existingData)
    isNewInvoiceNumber.mockReturnValue(true)
    createDBFromExisting.mockReturnValue({ newData: 'newValue' })
    getWhereFilter.mockReturnValue({ invoiceNumber: null })

    await updatePayment(event)

    expect(createData).toHaveBeenCalledWith(event, transaction)
    expect(getExistingDataFull).toHaveBeenCalledWith(event.data, transaction)
    expect(isNewInvoiceNumber).toHaveBeenCalledWith(event, existingData)
    expect(createDBFromExisting).toHaveBeenCalledWith(dbData, existingData, transaction)
    expect(getWhereFilter).toHaveBeenCalledWith(event)
    expect(db.reportData.destroy).toHaveBeenCalledWith({
      where: { invoiceNumber: '123' },
      transaction
    })
    expect(updateLedgerSplit).toHaveBeenCalledWith({ newData: 'newValue' })
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should handle existing invoice number case and update report data', async () => {
    const event = { data: { someData: 'someValue', originalInvoiceNumber: '123' } }
    const dbData = { id: 1 }
    const existingData = { invoiceNumber: '123' }
    createData.mockResolvedValue(dbData)
    getExistingDataFull.mockResolvedValue(existingData)
    isNewInvoiceNumber.mockReturnValue(false)
    getWhereFilter.mockReturnValue({ invoiceNumber: '123' })

    await updatePayment(event)

    expect(createData).toHaveBeenCalledWith(event, transaction)
    expect(getExistingDataFull).toHaveBeenCalledWith(event.data, transaction)
    expect(isNewInvoiceNumber).toHaveBeenCalledWith(event, existingData)
    expect(getWhereFilter).toHaveBeenCalledWith(event)
    expect(db.reportData.update).toHaveBeenCalledWith({ ...dbData }, {
      where: { invoiceNumber: '123' },
      transaction
    })
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should rollback transaction on error', async () => {
    const event = { data: { someData: 'someValue' } }
    createData.mockRejectedValue(new Error('Some error'))

    await expect(updatePayment(event)).rejects.toThrow('Some error')

    expect(transaction.rollback).toHaveBeenCalled()
  })
})

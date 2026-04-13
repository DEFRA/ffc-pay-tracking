const db = require('../../../../app/data')
const { createData } = require('../../../../app/payment/create-data')
const { getExistingDataFull } = require('../../../../app/helpers/get-existing-data-full')
const { isNewSplitInvoiceNumber } = require('../../../../app/payment/is-new-split-invoice-number')
const { createDBFromExisting } = require('../../../../app/payment/create-db-from-existing')
const { getWhereFilter } = require('../../../../app/helpers/get-where-filter')
const { sendUpdateFailureEvent } = require('../../../../app/event/send-update-failure')
const { updateExistingRecord } = require('../../../../app/payment/update-existing-record')
const { updatePayment } = require('../../../../app/payment/update')

jest.mock('../../../../app/data')
jest.mock('../../../../app/payment/create-data')
jest.mock('../../../../app/helpers/get-existing-data-full')
jest.mock('../../../../app/payment/is-new-split-invoice-number')
jest.mock('../../../../app/payment/create-db-from-existing')
jest.mock('../../../../app/helpers/get-where-filter')
jest.mock('../../../../app/event/send-update-failure')
jest.mock('../../../../app/payment/update-existing-record')

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
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should create new report data when there is no existing data', async () => {
    const event = { data: { someData: 'someValue' } }
    const dbData = { reportDataId: 1 }
    createData.mockResolvedValue(dbData)
    getExistingDataFull.mockResolvedValue(null)

    await updatePayment(event)

    expect(createData).toHaveBeenCalledWith(event, transaction)
    expect(getExistingDataFull).toHaveBeenCalledWith(event.data, transaction)
    expect(db.reportData.create).toHaveBeenCalledWith({ ...dbData }, { transaction })
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should create new split invoice and update original when split invoice number is detected', async () => {
    const event = { data: { invoiceNumber: 'INV123AV' } }
    const dbData = { invoiceNumber: 'INV123AV', value: 100 }
    const existingData = { invoiceNumber: 'INV123', value: 200 }

    createData.mockResolvedValue(dbData)
    getExistingDataFull.mockResolvedValue(existingData)
    isNewSplitInvoiceNumber.mockReturnValue(true)
    createDBFromExisting.mockResolvedValue()
    updateExistingRecord.mockResolvedValue()

    await updatePayment(event)

    expect(createDBFromExisting).toHaveBeenCalledWith(dbData, existingData, transaction)
    expect(updateExistingRecord).toHaveBeenCalledWith(dbData, 'INV123V0', transaction)
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should update existing data when not a new split invoice', async () => {
    const event = { data: { invoiceNumber: 'INV123' } }
    const dbData = { invoiceNumber: 'INV123', value: 100 }
    const existingData = { invoiceNumber: 'INV123', value: 200 }
    const where = { invoiceNumber: 'INV123' }

    createData.mockResolvedValue(dbData)
    getExistingDataFull.mockResolvedValue(existingData)
    isNewSplitInvoiceNumber.mockReturnValue(false)
    getWhereFilter.mockReturnValue(where)

    await updatePayment(event)

    expect(db.reportData.update).toHaveBeenCalledWith({ ...dbData }, { where, transaction })
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should handle split invoice with AV suffix in update', async () => {
    const event = { data: { invoiceNumber: 'INV123AV' } }
    const dbData = { invoiceNumber: 'INV123AV', value: 100 }
    const existingData = { invoiceNumber: 'INV123', value: 200 }
    const where = { invoiceNumber: 'INV123AV' }
    const originalRecord = { invoiceNumber: 'INV123V0', value: 200 }

    createData.mockResolvedValue(dbData)
    getExistingDataFull.mockResolvedValue(existingData)
    isNewSplitInvoiceNumber.mockReturnValue(false)
    getWhereFilter.mockReturnValue(where)
    db.reportData.findOne.mockResolvedValue(originalRecord)
    updateExistingRecord.mockResolvedValue()

    await updatePayment(event)

    expect(db.reportData.update).toHaveBeenCalledWith({ ...dbData }, { where, transaction })
    expect(db.reportData.findOne).toHaveBeenCalled()
    expect(updateExistingRecord).toHaveBeenCalledWith(dbData, 'INV123V0', transaction)
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should handle split invoice with BV suffix in update', async () => {
    const event = { data: { invoiceNumber: 'INV456BV' } }
    const dbData = { invoiceNumber: 'INV456BV', value: 150 }
    const existingData = { invoiceNumber: 'INV456', value: 300 }
    const where = { invoiceNumber: 'INV456BV' }
    const originalRecord = { invoiceNumber: 'INV456V0', value: 300 }

    createData.mockResolvedValue(dbData)
    getExistingDataFull.mockResolvedValue(existingData)
    isNewSplitInvoiceNumber.mockReturnValue(false)
    getWhereFilter.mockReturnValue(where)
    db.reportData.findOne.mockResolvedValue(originalRecord)
    updateExistingRecord.mockResolvedValue()

    await updatePayment(event)

    expect(updateExistingRecord).toHaveBeenCalledWith(dbData, 'INV456V0', transaction)
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should rollback transaction on error', async () => {
    const event = { data: { someData: 'someValue' } }
    createData.mockRejectedValue(new Error('Some error'))

    await expect(updatePayment(event)).rejects.toThrow('Some error')

    expect(transaction.rollback).toHaveBeenCalled()
    expect(sendUpdateFailureEvent).toHaveBeenCalled()
  })
})

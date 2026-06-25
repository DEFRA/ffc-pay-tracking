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
    db.Sequelize = {
      Op: {
        and: 'and',
        or: 'or',
        like: 'like',
        notIn: 'notIn'
      }
    }

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
    const event = { data: { invoiceNumber: 'INV123456AV01' } }
    const dbData = { invoiceNumber: 'INV123456AV01', sourceSystem: 'FPTT', value: 100 }
    const existingData = { invoiceNumber: 'INV123456V001', sourceSystem: 'FPTT', value: 200 }

    createData.mockResolvedValue(dbData)
    getExistingDataFull.mockResolvedValue(existingData)
    isNewSplitInvoiceNumber.mockReturnValue(true)
    createDBFromExisting.mockResolvedValue()
    updateExistingRecord.mockResolvedValue()

    await updatePayment(event)

    expect(createDBFromExisting).toHaveBeenCalledWith(dbData, existingData, transaction)
    expect(updateExistingRecord).toHaveBeenCalledWith(dbData, 'INV123456V001', transaction)
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should update existing data when not a new split invoice', async () => {
    const event = { data: { invoiceNumber: 'INV123456V001' } }
    const dbData = { invoiceNumber: 'INV123456V001', sourceSystem: 'FPTT', value: 100 }
    const existingData = { invoiceNumber: 'INV123456V001', sourceSystem: 'FPTT', value: 200 }
    const where = { invoiceNumber: 'INV123456V001' }

    createData.mockResolvedValue(dbData)
    getExistingDataFull.mockResolvedValue(existingData)
    isNewSplitInvoiceNumber.mockReturnValue(false)
    getWhereFilter.mockReturnValue(where)

    await updatePayment(event)

    expect(db.reportData.update).toHaveBeenCalledWith({ ...dbData }, { where, transaction })
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should handle split invoice with AV suffix in update', async () => {
    const event = { data: { invoiceNumber: 'INV123456AV01' } }
    const dbData = { invoiceNumber: 'INV123456AV01', sourceSystem: 'FPTT', value: 100 }
    const existingData = { invoiceNumber: 'INV123456V001', sourceSystem: 'FPTT', value: 200 }
    const where = { invoiceNumber: 'INV123456AV01' }
    const originalRecord = { invoiceNumber: 'INV123456V001', value: 200 }

    createData.mockResolvedValue(dbData)
    getExistingDataFull.mockResolvedValue(existingData)
    isNewSplitInvoiceNumber.mockReturnValue(false)
    getWhereFilter.mockReturnValue(where)
    db.reportData.findOne.mockResolvedValue(originalRecord)
    updateExistingRecord.mockResolvedValue()

    await updatePayment(event)

    expect(db.reportData.update).toHaveBeenCalledWith({ ...dbData }, { where, transaction })
    expect(db.reportData.findOne).toHaveBeenCalledTimes(1)

    const findOneArg = db.reportData.findOne.mock.calls[0][0]
    expect(findOneArg).toHaveProperty('where')
    expect(findOneArg.where[db.Sequelize.Op.and]).toEqual(expect.arrayContaining([
      expect.objectContaining({}),
      expect.objectContaining({ invoiceNumber: expect.objectContaining({ [db.Sequelize.Op.like]: 'INV123456%' }) }),
      expect.objectContaining({ invoiceNumber: expect.objectContaining({ [db.Sequelize.Op.notIn]: ['INV123456AV01', 'INV123456BV01'] }) })
    ]))

    expect(updateExistingRecord).toHaveBeenCalledWith(dbData, 'INV123456V001', transaction)
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should handle split invoice with BV suffix in update', async () => {
    const event = { data: { invoiceNumber: 'INV123456BV01' } }
    const dbData = { invoiceNumber: 'INV123456BV01', sourceSystem: 'FPTT', value: 150 }
    const existingData = { invoiceNumber: 'INV123456V001', sourceSystem: 'FPTT', value: 300 }
    const where = { invoiceNumber: 'INV123456BV01' }
    const originalRecord = { invoiceNumber: 'INV123456V001', value: 300 }

    createData.mockResolvedValue(dbData)
    getExistingDataFull.mockResolvedValue(existingData)
    isNewSplitInvoiceNumber.mockReturnValue(false)
    getWhereFilter.mockReturnValue(where)
    db.reportData.findOne.mockResolvedValue(originalRecord)
    updateExistingRecord.mockResolvedValue()

    await updatePayment(event)

    expect(db.reportData.findOne).toHaveBeenCalledTimes(1)

    const findOneArg = db.reportData.findOne.mock.calls[0][0]
    expect(findOneArg.where[db.Sequelize.Op.and]).toEqual(expect.arrayContaining([
      expect.objectContaining({}),
      expect.objectContaining({ invoiceNumber: expect.objectContaining({ [db.Sequelize.Op.like]: 'INV123456%' }) }),
      expect.objectContaining({ invoiceNumber: expect.objectContaining({ [db.Sequelize.Op.notIn]: ['INV123456BV01', 'INV123456AV01'] }) })
    ]))

    expect(updateExistingRecord).toHaveBeenCalledWith(dbData, 'INV123456V001', transaction)
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

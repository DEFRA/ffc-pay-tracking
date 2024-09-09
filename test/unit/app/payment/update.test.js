const db = require('../../../../app/data')
const { createData } = require('../../../../app/payment/create-data')
const { getExistingDataFull } = require('../../../../app/helpers/get-existing-data-full')
const { updatePayment } = require('../../../../app/payment/update')

jest.mock('../../../../app/data')
jest.mock('../../../../app/payment/create-data')
jest.mock('../../../../app/helpers/get-existing-data-full')

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
      findAll: jest.fn()
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

  test('should rollback transaction on error', async () => {
    const event = { data: { someData: 'someValue' } }
    createData.mockRejectedValue(new Error('Some error'))

    await expect(updatePayment(event)).rejects.toThrow('Some error')

    expect(transaction.rollback).toHaveBeenCalled()
  })
})

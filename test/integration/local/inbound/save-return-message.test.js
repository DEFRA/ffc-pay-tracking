const { resetDatabase, closeDatabaseConnection } = require('../../../helpers')

jest.mock('../../../../app/inbound/get-existing-return-message')
const { getExistingReturnMessage: mockGetExistingReturnMessage } = require('../../../../app/inbound/get-existing-return-message')

const returnMessage = require('../../../mocks/payment-requests/return-message')

const db = require('../../../../app/data')

const { saveReturnMessage } = require('../../../../app/inbound/save-return-message')

const transactionSpy = jest.spyOn(db.sequelize, 'transaction')

describe('save payment request', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
    mockGetExistingReturnMessage.mockResolvedValue(null)
  })

  test('should check if return message exists with reference id', async () => {
    await saveReturnMessage(returnMessage)
    expect(mockGetExistingReturnMessage).toHaveBeenCalledWith(returnMessage.referenceId, expect.anything())
  })

  test('should save return message if not already exists', async () => {
    await saveReturnMessage(returnMessage)
    const savedReturnMessage = await db.returns.findOne({ where: { referenceId: returnMessage.referenceId } })
    expect(savedReturnMessage.referenceId).toBe(returnMessage.referenceId)
  })

  test('should not save return message if already exists', async () => {
    mockGetExistingReturnMessage.mockResolvedValue(returnMessage)
    await saveReturnMessage(returnMessage)
    const savedReturnMessage = await db.returns.findOne({ where: { referenceId: returnMessage.referenceId } })
    expect(savedReturnMessage).toBeNull()
  })

  test('should create transaction', async () => {
    await saveReturnMessage(returnMessage)
    expect(transactionSpy).toHaveBeenCalled()
  })

  test('should rollback transaction if error', async () => {
    mockGetExistingReturnMessage.mockRejectedValue(new Error('Test error'))
    await expect(saveReturnMessage(returnMessage)).rejects.toThrow('Test error')
    const savedReturnMessage = await db.returns.findOne({ where: { referenceId: returnMessage.referenceId } })
    expect(savedReturnMessage).toBeNull()
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})

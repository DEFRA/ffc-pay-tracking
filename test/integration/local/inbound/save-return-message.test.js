const { resetDatabase, closeDatabaseConnection } = require('../../../helpers')
/*
jest.mock('../../../../app/inbound/get-existing-payment-request')
const { getExistingPaymentRequest: mockGetExistingPaymentRequest } = require('../../../../app/inbound/get-existing-payment-request')

jest.mock('../../../../app/tracking/get-scheme-id')
const { getSchemeId: mockGetSchemeId } = require('../../../../app/tracking/get-scheme-id')
*/
const returnMessage = require('../../../mocks/payment-requests/return-message')

const db = require('../../../../app/data')

const { saveReturnMessage } = require('../../../../app/inbound/save-return-message')

const transactionSpy = jest.spyOn(db.sequelize, 'transaction')

describe('save payment request', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
  })
  /*
  test('should check if payment request exists with invoice number', async () => {
    await savePaymentRequest(paymentRequest)
    expect(mockGetExistingPaymentRequest).toHaveBeenCalledWith(paymentRequest.invoiceNumber, expect.anything())
  })
  */
  test('should save return message if not already exists', async () => {
    await saveReturnMessage(returnMessage)
    const savedReturnMessage = await db.returns.findOne({ where: { invoiceNumber: returnMessage.invoiceNumber } })
    expect(savedReturnMessage.invoiceNumber).toBe(returnMessage.invoiceNumber)
  })
  /*
  test('should not save payment request if already exists', async () => {
    mockGetExistingPaymentRequest.mockResolvedValue(paymentRequest)
    await savePaymentRequest(paymentRequest)
    const savedPaymentRequest = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(savedPaymentRequest).toBeNull()
  })
  */
  test('should create transaction', async () => {
    await saveReturnMessage(returnMessage)
    expect(transactionSpy).toHaveBeenCalled()
  })
  /*
  test('should rollback transaction if error', async () => {
    mockGetSchemeId.mockRejectedValue(new Error('Test error'))
    await expect(saveReturnMessage(returnMessage)).rejects.toThrow('Test error')
    const savedReturnMessage = await db.returns.findOne({ where: { invoiceNumber: returnMessage.invoiceNumber } })
    expect(savedReturnMessage).toBeNull()
  })
  */
  afterAll(async () => {
    await closeDatabaseConnection()
  })
})

const { resetDatabase, closeDatabaseConnection, saveReturnMessage } = require('../../../helpers')

const returnMessage = require('../../../mocks/payment-requests/return-message')

const { getExistingReturnMessage } = require('../../../../app/inbound/get-existing-return-message')

describe('get existing return message', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
    await saveReturnMessage(returnMessage)
  })

  test('should return saved return message if reference id exists', async () => {
    const returnResult = await getExistingReturnMessage(returnMessage.referenceId)
    expect(returnResult.referenceId).toBe(returnMessage.referenceId)
  })

  test('should return null if reference id does not exist', async () => {
    const returnResult = await getExistingReturnMessage('')
    expect(returnResult).toBeNull()
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})

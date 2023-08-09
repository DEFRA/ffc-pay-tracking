jest.mock('../../../app/inbound')
const { saveReturnMessage: mockSaveReturnMessage } = require('../../../app/inbound')

const receiver = require('../../mocks/messaging/receiver')
const message = require('../../mocks/messaging/message')

const { processReturnMessage } = require('../../../app/messaging/process-return-message')

const errorSpy = jest.spyOn(global.console, 'error')

describe('process payment message', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should save return message', async () => {
    await processReturnMessage(message, receiver)
    expect(mockSaveReturnMessage).toHaveBeenCalledWith(message.body)
  })

  test('should complete message if successfully processed', async () => {
    await processReturnMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should send processing error event if unable to process payment request', async () => {
    const error = new Error('Test error')
    mockSaveReturnMessage.mockRejectedValue(error)
    await processReturnMessage(message, receiver)
    expect(errorSpy).toHaveBeenCalledWith('Unable to process return message:', error)
  })

  test('should not complete message if unable to process payment request', async () => {
    const error = new Error('Test error')
    mockSaveReturnMessage.mockRejectedValue(error)
    await processReturnMessage(message, receiver)
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })
})

const receiver = require('../../mocks/messaging/receiver')
const message = require('../../mocks/messaging/message')

const { processProcessingMessage } = require('../../../app/messaging/process-processing-message')

const logSpy = jest.spyOn(global.console, 'log')

describe('process payment message', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('console log should have been called', async () => {
    await processProcessingMessage(message, receiver)

    expect(logSpy).toHaveBeenCalled()
  })

  test('console log should have been called once', async () => {
    await processProcessingMessage(message, receiver)

    expect(logSpy).toHaveBeenCalledTimes(1)
  })

  test('console log should have been called with message', async () => {
    await processProcessingMessage(message, receiver)
    
    expect(logSpy).toHaveBeenCalledWith('Processing message received: ', message)
  })
})

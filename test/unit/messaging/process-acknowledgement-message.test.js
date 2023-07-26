const receiver = require('../../mocks/messaging/receiver')
const message = require('../../mocks/messaging/message')

const { processAcknowledgementMessage } = require('../../../app/messaging/process-acknowledgement-message')

const logSpy = jest.spyOn(global.console, 'log')

describe('process payment message', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('console log should have been called', async () => {
    await processAcknowledgementMessage(message, receiver)

    expect(logSpy).toHaveBeenCalled()
  })

  test('console log should have been called once', async () => {
    await processAcknowledgementMessage(message, receiver)

    expect(logSpy).toHaveBeenCalledTimes(1)
  })

  test('console log should have been called with message', async () => {
    await processAcknowledgementMessage(message, receiver)

    expect(logSpy).toHaveBeenCalledWith('Acknowledgement message received: ', message)
  })
})

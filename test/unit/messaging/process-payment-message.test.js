const receiver = require('../../mocks/messaging/receiver')
const message = require('../../mocks/messaging/message')

const { processPaymentMessage } = require('../../../app/messaging/process-payment-message')

const logSpy = jest.spyOn(global.console, 'log')

describe('process payment message', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('console log should have been called', async () => {
    await processPaymentMessage(message, receiver)

    expect(logSpy).toHaveBeenCalled()
  })

  test('console log should have been called once', async () => {
    await processPaymentMessage(message, receiver)

    expect(logSpy).toHaveBeenCalledTimes(1)
  })

  test('console log should have been called with message', async () => {
    await processPaymentMessage(message, receiver)

    expect(logSpy).toHaveBeenCalledWith('Message received: ', message)
  })
})

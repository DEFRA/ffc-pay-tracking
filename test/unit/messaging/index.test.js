const { MessageReceiver } = require('ffc-messaging')

const mockMessageReceiverInstance = {
  subscribe: jest.fn(),
  closeConnection: jest.fn()
}

jest.mock('ffc-messaging', () => {
  return {
    MessageReceiver: jest.fn().mockImplementation(() => mockMessageReceiverInstance)
  }
})

jest.mock('../../../app/messaging/index', () => {
  const originalModule = jest.requireActual('../../../app/messaging/index')

  return {
    ...originalModule,
    paymentReceivers: [mockMessageReceiverInstance],
    stop: async () => {
      for (const paymentReceiver of [mockMessageReceiverInstance]) {
        await paymentReceiver.closeConnection()
      }
    }
  }
})

describe('index', () => {
  let closeConnectionSpy
  const { start, stop } = require('../../../app/messaging/index')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('start function', async () => {
    await start()
    expect(MessageReceiver).toHaveBeenCalled()
    expect(mockMessageReceiverInstance.subscribe).toHaveBeenCalled()
  })

  test('stop function', async () => {
    await start()
    closeConnectionSpy = jest.spyOn(mockMessageReceiverInstance, 'closeConnection')
    await stop()
    expect(closeConnectionSpy).toHaveBeenCalled()
  })
})

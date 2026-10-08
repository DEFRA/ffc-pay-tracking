jest.mock('../../../../app/config', () => ({
  messageConfig: {
    eventsSubscription: { host: 'events-host', address: 'events-sub', topic: 'events-topic' },
    retentionSubscription: { host: 'retention-host', address: 'retention-sub', topic: 'retention-topic' }
  }
}))
jest.mock('../../../../app/messaging/service-bus')
jest.mock('../../../../app/messaging/process-event-message', () => ({
  processEventMessage: jest.fn()
}))
jest.mock('../../../../app/messaging/process-retention-message', () => ({
  processRetentionMessage: jest.fn()
}))

const { messageConfig } = require('../../../../app/config')

describe('messaging index', () => {
  let mockSbClient
  let mockEventsReceiver
  let mockRetentionReceiver
  let serviceBus
  let processEventMessage
  let processRetentionMessage
  let start
  let stop

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    mockSbClient = { close: jest.fn().mockResolvedValue() }
    mockEventsReceiver = { name: 'events-receiver' }
    mockRetentionReceiver = { name: 'retention-receiver' }

    serviceBus = require('../../../../app/messaging/service-bus')
    serviceBus.createServiceBusClient.mockReturnValue(mockSbClient)
    serviceBus.createReceiver
      .mockReturnValueOnce(mockEventsReceiver)
      .mockReturnValueOnce(mockRetentionReceiver)
    serviceBus.subscribeReceiver.mockResolvedValue()
    serviceBus.closeSenders.mockResolvedValue()

    const processEventModule = require('../../../../app/messaging/process-event-message')
    processEventMessage = processEventModule.processEventMessage

    const processRetentionModule = require('../../../../app/messaging/process-retention-message')
    processRetentionMessage = processRetentionModule.processRetentionMessage

    const messaging = require('../../../../app/messaging')
    start = messaging.start
    stop = messaging.stop
  })

  describe('start', () => {
    test('creates Service Bus client from events subscription config', async () => {
      await start()

      expect(serviceBus.createServiceBusClient).toHaveBeenCalledWith(messageConfig.eventsSubscription)
    })

    test('creates and subscribes events receiver with config and action', async () => {
      await start()

      expect(serviceBus.createReceiver).toHaveBeenNthCalledWith(1, mockSbClient, messageConfig.eventsSubscription)
      expect(serviceBus.subscribeReceiver).toHaveBeenNthCalledWith(
        1,
        mockEventsReceiver,
        expect.any(Function),
        expect.any(Function),
        messageConfig.eventsSubscription
      )
    })

    test('creates and subscribes retention receiver with config and action', async () => {
      await start()

      expect(serviceBus.createReceiver).toHaveBeenNthCalledWith(2, mockSbClient, messageConfig.retentionSubscription)
      expect(serviceBus.subscribeReceiver).toHaveBeenNthCalledWith(
        2,
        mockRetentionReceiver,
        expect.any(Function),
        expect.any(Function),
        messageConfig.retentionSubscription
      )
    })

    test('wrapped events action calls processEventMessage with message and receiver', async () => {
      const message = { body: { id: 1 } }
      await start()

      const wrappedAction = serviceBus.subscribeReceiver.mock.calls[0][1]
      await wrappedAction(message)

      expect(processEventMessage).toHaveBeenCalledWith(message, mockEventsReceiver)
    })

    test('wrapped retention action calls processRetentionMessage with message and receiver', async () => {
      const message = { body: { id: 2 } }
      await start()

      const wrappedAction = serviceBus.subscribeReceiver.mock.calls[1][1]
      await wrappedAction(message)

      expect(processRetentionMessage).toHaveBeenCalledWith(message, mockRetentionReceiver)
    })

    test('error handler logs errors to console', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const error = new Error('receive failed')
      await start()

      const errorHandler = serviceBus.subscribeReceiver.mock.calls[0][2]
      errorHandler(error)

      expect(consoleSpy).toHaveBeenCalledWith('Error receiving message:', error)
      consoleSpy.mockRestore()
    })

    test('logs readiness message', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

      await start()

      expect(consoleSpy).toHaveBeenCalledWith('Ready to receive messages')
      consoleSpy.mockRestore()
    })
  })

  describe('stop', () => {
    test('closes Service Bus client and senders', async () => {
      await start()

      await stop()

      expect(mockSbClient.close).toHaveBeenCalledTimes(1)
      expect(serviceBus.closeSenders).toHaveBeenNthCalledWith(1, mockEventsReceiver)
      expect(serviceBus.closeSenders).toHaveBeenNthCalledWith(2, mockRetentionReceiver)
    })

    test('continues stop when Service Bus client close throws', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockSbClient.close.mockRejectedValue(new Error('close failed'))

      await start()
      await stop()

      expect(serviceBus.closeSenders).toHaveBeenCalledTimes(2)
      consoleSpy.mockRestore()
    })

    test('handles stop when start has not been called', async () => {
      await stop()

      expect(serviceBus.closeSenders).toHaveBeenNthCalledWith(1, undefined)
      expect(serviceBus.closeSenders).toHaveBeenNthCalledWith(2, undefined)
    })
  })
})

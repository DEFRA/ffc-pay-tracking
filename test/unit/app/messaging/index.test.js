const { messageConfig } = require('../../../../app/config')
const { MessageReceiver } = require('ffc-messaging')
const { processEventMessage } = require('../../../../app/messaging/process-event-message')
const { processRetentionMessage } = require('../../../../app/messaging/process-retention-message')
const { start, stop } = require('../../../../app/messaging')

jest.mock('ffc-messaging')
jest.mock('../../../../app/config')
jest.mock('../../../../app/messaging/process-event-message')
jest.mock('../../../../app/messaging/process-retention-message')

describe('Message Receivers Module', () => {
  let mockEventsSubscribe, mockRetentionSubscribe, mockEventsClose, mockRetentionClose

  beforeEach(() => {
    jest.clearAllMocks()

    mockEventsSubscribe = jest.fn().mockResolvedValue()
    mockRetentionSubscribe = jest.fn().mockResolvedValue()
    mockEventsClose = jest.fn().mockResolvedValue()
    mockRetentionClose = jest.fn().mockResolvedValue()

    MessageReceiver.mockImplementation((subscription, action) => {
      if (subscription === messageConfig.eventsSubscription) {
        return {
          subscribe: mockEventsSubscribe,
          closeConnection: mockEventsClose,
          subscription,
          action,
        }
      }
      if (subscription === messageConfig.retentionSubscription) {
        return {
          subscribe: mockRetentionSubscribe,
          closeConnection: mockRetentionClose,
          subscription,
          action,
        }
      }
      return {}
    })

    messageConfig.eventsSubscription = 'events-subscription'
    messageConfig.retentionSubscription = 'retention-subscription'
  })

  describe('start', () => {
    test('should instantiate MessageReceiver for events and retention with correct subscriptions and actions, then subscribe', async () => {
      await start()

      expect(MessageReceiver).toHaveBeenCalledTimes(2)

      const eventsCall = MessageReceiver.mock.calls[0]
      expect(eventsCall[0]).toBe(messageConfig.eventsSubscription)
      expect(typeof eventsCall[1]).toBe('function')

      const retentionCall = MessageReceiver.mock.calls[1]
      expect(retentionCall[0]).toBe(messageConfig.retentionSubscription)
      expect(typeof retentionCall[1]).toBe('function')

      expect(mockEventsSubscribe).toHaveBeenCalledTimes(1)
      expect(mockRetentionSubscribe).toHaveBeenCalledTimes(1)
    })

    test('should call processEventMessage with the message and eventsReceiver when event message action is triggered', async () => {
      await start()

      const processingAction = MessageReceiver.mock.calls[0][1]

      const fakeMessage = { id: 'event1' }
      processingAction(fakeMessage)

      expect(processEventMessage).toHaveBeenCalledWith(fakeMessage, expect.any(Object))
    })

    test('should call processRetentionMessage with the message and retentionReceiver when retention message action is triggered', async () => {
      await start()

      const retentionAction = MessageReceiver.mock.calls[1][1]

      const fakeMessage = { id: 'retention1' }
      retentionAction(fakeMessage)

      expect(processRetentionMessage).toHaveBeenCalledWith(fakeMessage, expect.any(Object))
    })

    test('should log readiness message', async () => {
      console.log = jest.fn()

      await start()

      expect(console.log).toHaveBeenCalledWith('Ready to receive messages')
    })
  })

  describe('stop', () => {
    test('should call closeConnection on both eventsReceiver and retentionReceiver', async () => {
      await start()

      await stop()

      expect(mockEventsClose).toHaveBeenCalledTimes(1)
      expect(mockRetentionClose).toHaveBeenCalledTimes(1)
    })
  })
})

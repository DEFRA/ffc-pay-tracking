const { processMessage } = require('../../../app/messaging/process-message')
const { updatePayment } = require('../../../app/payment')
const { updateWarning } = require('../../../app/warning')
const { PAYMENT_EVENT_PREFIX, WARNING_EVENT_PREFIX } = require('../../../app/constants/event-prefixes')

jest.mock('../../../app/payment')
jest.mock('../../../app/warning')

describe('processMessage', () => {
  let mockReceiver
  let mockMessage

  beforeEach(() => {
    mockReceiver = {
      completeMessage: jest.fn(),
      deadLetterMessage: jest.fn()
    }

    mockMessage = {
      body: {
        type: '',
        data: {
          frn: '12345',
          agreementNumber: '67890'
        },
        subject: 'Test subject'
      }
    }

    jest.clearAllMocks()
  })

  test('processes payment event', async () => {
    mockMessage.body.type = PAYMENT_EVENT_PREFIX
    await processMessage(mockMessage, mockReceiver)
    expect(updatePayment).toHaveBeenCalledWith(mockMessage.body)
    expect(mockReceiver.completeMessage).toHaveBeenCalledWith(mockMessage)
  })

  test('processes warning event', async () => {
    mockMessage.body.type = WARNING_EVENT_PREFIX
    await processMessage(mockMessage, mockReceiver)
    expect(updateWarning).toHaveBeenCalledWith(mockMessage.body)
    expect(mockReceiver.completeMessage).toHaveBeenCalledWith(mockMessage)
  })

  test('handles error when warning processing throws', async () => {
    mockMessage.body.type = WARNING_EVENT_PREFIX
    const error = new Error('Warning processing failed')
    updateWarning.mockImplementation(() => {
      throw error
    })
    await processMessage(mockMessage, mockReceiver)
    expect(updateWarning).toHaveBeenCalledWith(mockMessage.body)
    expect(mockReceiver.deadLetterMessage).toHaveBeenCalledWith(mockMessage)
    expect(mockReceiver.completeMessage).not.toHaveBeenCalled()
  })
})

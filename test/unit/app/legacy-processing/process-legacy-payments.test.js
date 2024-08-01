const api = require('../../../../app/api')
const { processingConfig } = require('../../../../app/config')
const { processLegacyPaymentRequest } = require('../../../../app/legacy-processing/process-legacy-payment-request')
const { processLegacyPayments } = require('../../../../app/legacy-processing/process-legacy-payments')

jest.mock('../../../../app/api', () => ({
  get: jest.fn()
}))

jest.mock('../../../../app/legacy-processing/process-legacy-payment-request', () => ({
  processLegacyPaymentRequest: jest.fn()
}))

describe('process legacy payment requests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should process each payment request if completedPaymentRequests is empty or not present', async () => {
    const mockResponse = {
      payload: {
        paymentRequestsBatch: [
          {
            paymentRequestId: 1,
            completedPaymentRequests: []
          },
          {
            paymentRequestId: 2,
            completedPaymentRequests: null
          }
        ]
      }
    }
    api.get.mockResolvedValue(mockResponse)

    await processLegacyPayments()

    expect(api.get).toHaveBeenCalledWith(`/tracking-migration?limit=${processingConfig.processingCap}`)
    expect(processLegacyPaymentRequest).toHaveBeenCalledTimes(2)
    expect(processLegacyPaymentRequest).toHaveBeenCalledWith({ paymentRequestId: 1, completedPaymentRequests: [] })
    expect(processLegacyPaymentRequest).toHaveBeenCalledWith({ paymentRequestId: 2, completedPaymentRequests: null })
  })

  test('should process each completedPaymentRequest individually', async () => {
    const mockResponse = {
      payload: {
        paymentRequestsBatch: [
          {
            paymentRequestId: 1,
            completedPaymentRequests: [{ completedPaymentRequestId: 1 }, { completedPaymentRequestId: 2 }]
          },
          {
            paymentRequestId: 2,
            completedPaymentRequests: [{ completedPaymentRequestId: 3 }]
          }
        ]
      }
    }
    api.get.mockResolvedValue(mockResponse)

    await processLegacyPayments()

    expect(api.get).toHaveBeenCalledWith(`/tracking-migration?limit=${processingConfig.processingCap}`)
    expect(processLegacyPaymentRequest).toHaveBeenCalledTimes(3)
    expect(processLegacyPaymentRequest).toHaveBeenCalledWith({
      paymentRequestId: 1,
      completedPaymentRequests: [{ completedPaymentRequestId: 1 }]
    })
    expect(processLegacyPaymentRequest).toHaveBeenCalledWith({
      paymentRequestId: 1,
      completedPaymentRequests: [{ completedPaymentRequestId: 2 }]
    })
    expect(processLegacyPaymentRequest).toHaveBeenCalledWith({
      paymentRequestId: 2,
      completedPaymentRequests: [{ completedPaymentRequestId: 3 }]
    })
  })

  test('should handle errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    api.get.mockRejectedValue(new Error('API error'))

    await processLegacyPayments()

    expect(api.get).toHaveBeenCalledWith(`/tracking-migration?limit=${processingConfig.processingCap}`)
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch legacy payment request data:', expect.any(Error))

    consoleErrorSpy.mockRestore()
  })
})

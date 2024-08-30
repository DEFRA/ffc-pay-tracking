const { getTransactionSummaryData } = require('../../../../../app/report-data/get-transaction-summary-data')
const { options } = require('../../../../../app/server/routes/transaction-summary')

jest.mock('../../../../../app/report-data/get-transaction-summary-data')

describe('GET /transaction-summary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return transaction summary data when schemeId and frn are provided', async () => {
    const mockData = [{ id: 1, value: 'test data' }]
    getTransactionSummaryData.mockResolvedValue(mockData)

    const schemeId = 1
    const frn = 123456
    const mockRequest = {
      query: {
        schemeId,
        frn
      }
    }
    const mockH = {
      response: jest.fn().mockReturnThis()
    }

    await options.handler(mockRequest, mockH)

    expect(getTransactionSummaryData).toHaveBeenCalledWith(schemeId, frn)
    expect(getTransactionSummaryData).toHaveBeenCalledTimes(1)
    expect(mockH.response).toHaveBeenCalledWith({ reportData: mockData })
  })

  test('should return transaction summary data when frn is not provided', async () => {
    const mockData = [{ id: 1, value: 'test data' }]
    getTransactionSummaryData.mockResolvedValue(mockData)

    const schemeId = 1
    const mockRequest = {
      query: {
        schemeId
      }
    }
    const mockH = {
      response: jest.fn().mockReturnThis()
    }

    await options.handler(mockRequest, mockH)

    expect(getTransactionSummaryData).toHaveBeenCalledWith(schemeId, undefined)
    expect(getTransactionSummaryData).toHaveBeenCalledTimes(1)
    expect(mockH.response).toHaveBeenCalledWith({ reportData: mockData })
  })
})

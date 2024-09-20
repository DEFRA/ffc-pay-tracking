const { getTransactionSummaryData } = require('../../../../../app/report-data/get-transaction-summary-data')
const { options } = require('../../../../../app/server/routes/transaction-summary')

jest.mock('../../../../../app/report-data/get-transaction-summary-data')

describe('GET /transaction-summary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return transaction summary data when schemeId, year, prn, revenueOrCapital, and frn are provided', async () => {
    const mockData = [{ id: 1, value: 'test data' }]
    getTransactionSummaryData.mockResolvedValue(mockData)

    const schemeId = 1
    const year = 2023
    const prn = 1
    const revenueOrCapital = 'revenue'
    const frn = 123456
    const mockRequest = {
      query: {
        schemeId,
        year,
        prn,
        revenueOrCapital,
        frn
      }
    }
    const mockH = {
      response: jest.fn().mockReturnThis()
    }

    await options.handler(mockRequest, mockH)

    expect(getTransactionSummaryData).toHaveBeenCalledWith(schemeId, year, prn, revenueOrCapital, frn)
    expect(getTransactionSummaryData).toHaveBeenCalledTimes(1)
    expect(mockH.response).toHaveBeenCalledWith({ reportData: mockData })
  })

  test('should return transaction summary data when frn is not provided', async () => {
    const mockData = [{ id: 1, value: 'test data' }]
    getTransactionSummaryData.mockResolvedValue(mockData)

    const schemeId = 1
    const year = 2023
    const prn = 1
    const revenueOrCapital = 'capital'
    const mockRequest = {
      query: {
        schemeId,
        year,
        prn,
        revenueOrCapital
      }
    }
    const mockH = {
      response: jest.fn().mockReturnThis()
    }

    await options.handler(mockRequest, mockH)

    expect(getTransactionSummaryData).toHaveBeenCalledWith(schemeId, year, prn, revenueOrCapital, undefined)
    expect(getTransactionSummaryData).toHaveBeenCalledTimes(1)
    expect(mockH.response).toHaveBeenCalledWith({ reportData: mockData })
  })

  test('should return transaction summary data when only schemeId is provided', async () => {
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

    expect(getTransactionSummaryData).toHaveBeenCalledWith(schemeId, undefined, undefined, undefined, undefined)
    expect(getTransactionSummaryData).toHaveBeenCalledTimes(1)
    expect(mockH.response).toHaveBeenCalledWith({ reportData: mockData })
  })
})

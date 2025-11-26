const { getFilteredReportData } = require('../../../../../app/report-data/get-filtered-report-data')
const { options } = require('../../../../../app/server/routes/transaction-summary')

jest.mock('../../../../../app/report-data/get-filtered-report-data')

describe('GET /transaction-summary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return file path when all query params are provided', async () => {
    const mockFilePath = '/path/to/transaction-summary.csv'
    getFilteredReportData.mockResolvedValue(mockFilePath)

    const mockRequest = {
      query: {
        schemeId: 1,
        year: 2023,
        prn: 1,
        revenueOrCapital: 'revenue',
        frn: 123456
      }
    }
    const mockH = {
      response: jest.fn().mockReturnThis()
    }

    await options.handler(mockRequest, mockH)

    expect(getFilteredReportData).toHaveBeenCalledWith(1, 2023, 1, 'revenue', 123456, true)
    expect(mockH.response).toHaveBeenCalledWith({ file: mockFilePath })
  })

  test('should return file path when frn is not provided', async () => {
    const mockFilePath = '/path/to/transaction-summary.csv'
    getFilteredReportData.mockResolvedValue(mockFilePath)

    const mockRequest = {
      query: {
        schemeId: 1,
        year: 2023,
        prn: 1,
        revenueOrCapital: 'capital'
      }
    }
    const mockH = {
      response: jest.fn().mockReturnThis()
    }

    await options.handler(mockRequest, mockH)

    expect(getFilteredReportData).toHaveBeenCalledWith(1, 2023, 1, 'capital', undefined, true)
    expect(mockH.response).toHaveBeenCalledWith({ file: mockFilePath })
  })

  test('should return file path when only schemeId is provided', async () => {
    const mockFilePath = '/path/to/transaction-summary.csv'
    getFilteredReportData.mockResolvedValue(mockFilePath)

    const mockRequest = {
      query: {
        schemeId: 1
      }
    }
    const mockH = {
      response: jest.fn().mockReturnThis()
    }

    await options.handler(mockRequest, mockH)

    expect(getFilteredReportData).toHaveBeenCalledWith(1, undefined, undefined, undefined, undefined, true)
    expect(mockH.response).toHaveBeenCalledWith({ file: mockFilePath })
  })
})

const { getARReportData } = require('../../../../../app/report-data/get-AR-report-data')
const { options } = require('../../../../../app/server/routes/ar-report-data')

jest.mock('../../../../../app/report-data/get-AR-report-data')

describe('GET /ar-report-data', () => {
  test('should return AR report data when startDate and endDate are provided', async () => {
    const mockData = [{ arValue: 1 }, { arValue: 2 }]
    getARReportData.mockResolvedValue(mockData)

    const startDate = '2022-01-01'
    const endDate = '2022-12-31'
    const mockRequest = {
      query: {
        startDate,
        endDate
      }
    }
    const mockH = {
      response: jest.fn().mockReturnThis()
    }

    await options.handler(mockRequest, mockH)

    expect(mockH.response).toHaveBeenCalledWith({ arReportData: mockData })
  })

  test('should return AR report data when startDate and endDate are not provided', async () => {
    const mockData = [{ arValue: 1 }, { arValue: 2 }]
    getARReportData.mockResolvedValue(mockData)

    const mockRequest = {
      query: {}
    }
    const mockH = {
      response: jest.fn().mockReturnThis()
    }

    await options.handler(mockRequest, mockH)

    expect(mockH.response).toHaveBeenCalledWith({ arReportData: mockData })
  })
})

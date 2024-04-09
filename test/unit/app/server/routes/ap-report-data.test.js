const { getAPReportData } = require('../../../../../app/report-data/get-AP-report-data')
const { options } = require('../../../../../app/server/routes/ap-report-data')

jest.mock('../../../../../app/report-data/get-AP-report-data')

describe('GET /ap-report-data', () => {
  test('should return AP report data when startDate and endDate are provided', async () => {
    const mockData = [{ apValue: 1 }, { apValue: 2 }]
    getAPReportData.mockResolvedValue(mockData)

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

    expect(mockH.response).toHaveBeenCalledWith({ apReportData: mockData })
  })

  test('should return AP report data when startDate and endDate are not provided', async () => {
    const mockData = [{ apValue: 1 }, { apValue: 2 }]
    getAPReportData.mockResolvedValue(mockData)

    const mockRequest = {
      query: {}
    }
    const mockH = {
      response: jest.fn().mockReturnThis()
    }

    await options.handler(mockRequest, mockH)

    expect(mockH.response).toHaveBeenCalledWith({ apReportData: mockData })
  })
})

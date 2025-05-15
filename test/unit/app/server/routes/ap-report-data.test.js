const { getAPARReportData } = require('../../../../../app/report-data/get-AP-AR-report-data')
const { options } = require('../../../../../app/server/routes/ap-report-data')
const { AP } = require('../../../../../app/constants/ledgers')

jest.mock('../../../../../app/report-data/get-AP-AR-report-data')

describe('GET /ap-report-data', () => {
  test('should return file path when startDate and endDate are provided', async () => {
    const mockFilePath = '/path/to/ap-report.csv'
    getAPARReportData.mockResolvedValue(mockFilePath)

    const mockRequest = {
      query: {
        startDate: '2022-01-01',
        endDate: '2022-12-31'
      }
    }
    const mockH = {
      response: jest.fn().mockReturnThis()
    }

    await options.handler(mockRequest, mockH)

    expect(getAPARReportData).toHaveBeenCalledWith(new Date('2022-01-01'), new Date('2022-12-31'), AP)
    expect(mockH.response).toHaveBeenCalledWith({ file: mockFilePath })
  })

  test('should return file path when startDate and endDate are not provided', async () => {
    const mockFilePath = '/path/to/ap-report.csv'
    getAPARReportData.mockResolvedValue(mockFilePath)

    const mockRequest = {
      query: {}
    }
    const mockH = {
      response: jest.fn().mockReturnThis()
    }

    await options.handler(mockRequest, mockH)

    expect(getAPARReportData).toHaveBeenCalledWith(null, null, AP)
    expect(mockH.response).toHaveBeenCalledWith({ file: mockFilePath })
  })
})

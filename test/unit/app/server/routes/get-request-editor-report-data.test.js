const { handler } = require('../../../../../app/server/routes/request-editor-report-data').options
const { getRequestEditorReportData } = require('../../../../../app/report-data/get-request-editor-report-data')

jest.mock('../../../../../app/report-data/get-request-editor-report-data')

describe('request-editor-report-data', () => {
  test('should call getRequestEditorReportData with correct arguments and return response', async () => {
    const mockStartDate = new Date()
    const mockEndDate = new Date()
    const mockRequest = {
      query: {
        startDate: mockStartDate.toISOString(),
        endDate: mockEndDate.toISOString()
      }
    }
    const mockH = {
      response: jest.fn()
    }
    const reReportData = { data: 'mock data' }
    getRequestEditorReportData.mockResolvedValue(reReportData)

    await handler(mockRequest, mockH)

    expect(getRequestEditorReportData).toHaveBeenCalledWith(mockStartDate, mockEndDate)
    expect(mockH.response).toHaveBeenCalledWith({ reReportData })
  })
})

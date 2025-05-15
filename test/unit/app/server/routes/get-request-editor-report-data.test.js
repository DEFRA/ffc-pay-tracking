const { handler } = require('../../../../../app/server/routes/request-editor-report-data').options
const { getRequestEditorReportData } = require('../../../../../app/report-data/get-request-editor-report-data')

jest.mock('../../../../../app/report-data/get-request-editor-report-data')

describe('request-editor-report-data', () => {
  test('should call getRequestEditorReportData and return file path in response', async () => {
    const mockRequest = {}
    const mockH = {
      response: jest.fn()
    }
    const mockReportLocation = '/path/to/report.csv'
    getRequestEditorReportData.mockResolvedValue(mockReportLocation)

    await handler(mockRequest, mockH)

    expect(getRequestEditorReportData).toHaveBeenCalled()
    expect(mockH.response).toHaveBeenCalledWith({ file: mockReportLocation })
  })
})

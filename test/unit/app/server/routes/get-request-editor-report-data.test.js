const { handler } = require('../../../../../app/server/routes/request-editor-report-data').options

jest.mock('../../../../../app/server/routes/request-editor-report-data', () => ({
  options: {
    handler: jest.fn()
  }
}))

describe('request-editor-report-data', () => {
  test('should call handler with correct arguments and return response', async () => {
    const mockStartDate = new Date()
    const mockEndDate = new Date()
    const mockRequest = {
      query: {
        startDate: mockStartDate.toISOString(),
        endDate: mockEndDate.toISOString()
      }
    }
    const mockResponse = jest.fn()
    const mockHandler = jest.fn(() => ({ response: mockResponse }))

    const reReportData = { data: 'mock data' }
    handler.mockResolvedValue(reReportData)

    const result = await handler(mockRequest, { h: mockHandler })

    expect(handler).toHaveBeenCalledWith(mockRequest, { h: mockHandler })
    expect(result).toEqual(reReportData)
  })
})

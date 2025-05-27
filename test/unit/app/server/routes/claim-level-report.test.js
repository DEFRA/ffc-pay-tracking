const { handler } = require('../../../../../app/server/routes/claim-level-report').options
const { getClaimLevelReportData } = require('../../../../../app/report-data/get-claim-level-report-data')

jest.mock('../../../../../app/report-data/get-claim-level-report-data')

describe('Claim Level Report', () => {
  test('should call getClaimLevelReportData with correct parameters and return file location', async () => {
    const mockRequest = {
      query: {
        schemeId: 'SFI',
        year: 2024,
        revenueOrCapital: 'revenue',
        frn: '1234567890'
      }
    }
    const mockH = {
      response: jest.fn()
    }

    const mockReportLocation = '/path/to/claim-report.csv'
    getClaimLevelReportData.mockResolvedValue(mockReportLocation)

    await handler(mockRequest, mockH)

    expect(getClaimLevelReportData).toHaveBeenCalledWith(
      'SFI', 2024, 'revenue', '1234567890'
    )
    expect(mockH.response).toHaveBeenCalledWith({ file: mockReportLocation })
  })
})

const { handler } = require('../../../../../app/server/routes/claim-level-report').options
const { getClaimLevelReportData } = require('../../../../../app/report-data/get-claim-level-report-data')

jest.mock('../../../../../app/report-data/get-claim-level-report-data')

describe('Claim Level Report', () => {
  test('should call getClaimLevelReportData with correct parameters', async () => {
    const mockRequest = {
      query: {
        startDate: '2021-01-01',
        endDate: '2021-12-31'
      }
    }
    const mockH = {
      response: jest.fn().mockReturnThis()
    }

    getClaimLevelReportData.mockResolvedValue({ claimLevelReportData: [] })

    await handler(mockRequest, mockH)

    expect(getClaimLevelReportData).toHaveBeenCalledWith('2021-01-01', '2021-12-31')
    expect(mockH.response).toHaveBeenCalledWith({ claimLevelReportData: { claimLevelReportData: [] } })
  })
})

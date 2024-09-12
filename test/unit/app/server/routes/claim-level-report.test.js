const { handler } = require('../../../../../app/server/routes/claim-level-report').options
const { SFI } = require('../../../../../app/constants/schemes')
const { getClaimLevelReportData } = require('../../../../../app/report-data/get-claim-level-report-data')

jest.mock('../../../../../app/report-data/get-claim-level-report-data')

describe('Claim Level Report', () => {
  test('should call getClaimLevelReportData with correct parameters', async () => {
    const mockRequest = {
      query: {
        schemeId: SFI
      }
    }
    const mockH = {
      response: jest.fn().mockReturnThis()
    }

    getClaimLevelReportData.mockResolvedValue({ claimLevelReportData: [] })

    await handler(mockRequest, mockH)

    expect(getClaimLevelReportData).toHaveBeenCalled()
    expect(mockH.response).toHaveBeenCalledWith({ claimLevelReportData: { claimLevelReportData: [] } })
  })
})

const { GET } = require('../../constants/methods')
const { getClaimLevelReportData } = require('../../report-data/get-claim-level-report-data')

module.exports = {
  method: GET,
  path: '/claim-level-report-data',
  options: {
    handler: async (request, h) => {
      const { startDate, endDate } = request.query
      const claimLevelReportData = await getClaimLevelReportData(startDate, endDate)
      return h.response({ claimLevelReportData })
    }
  }
}

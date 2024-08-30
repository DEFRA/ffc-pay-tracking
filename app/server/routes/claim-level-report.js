const { GET } = require('../../constants/methods')
const { getClaimLevelReportData } = require('../../report-data/get-claim-level-report-data')

module.exports = {
  method: GET,
  path: '/claim-level-report',
  options: {
    handler: async (request, h) => {
      const claimLevelReportData = await getClaimLevelReportData()
      return h.response({ claimLevelReportData })
    }
  }
}

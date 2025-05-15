const { GET } = require('../../constants/methods')
const { getClaimLevelReportData } = require('../../report-data/get-claim-level-report-data')

module.exports = {
  method: GET,
  path: '/claim-level-report',
  options: {
    handler: async (request, h) => {
      const { schemeId, year, revenueOrCapital, frn } = request.query

      const reportLocation = await getClaimLevelReportData(schemeId, year, revenueOrCapital, frn)

      return h.response({ file: reportLocation })
    }
  }
}

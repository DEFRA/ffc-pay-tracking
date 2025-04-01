const { GET } = require('../../constants/methods')
const { getFilteredReportData } = require('../../report-data/get-filtered-report-data')

module.exports = {
  method: GET,
  path: '/transaction-summary',
  options: {
    handler: async (request, h) => {
      const { schemeId, year, prn, revenueOrCapital, frn } = request.query
      const reportData = await getFilteredReportData(schemeId, year, prn, revenueOrCapital, frn)
      return h.response({ reportData })
    }
  }
}

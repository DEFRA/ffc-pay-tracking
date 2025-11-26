const { GET } = require('../../constants/methods')
const { getFilteredReportData } = require('../../report-data/get-filtered-report-data')

module.exports = {
  method: GET,
  path: '/transaction-summary',
  options: {
    handler: async (request, h) => {
      const { schemeId, year, prn, revenueOrCapital, frn } = request.query

      const reportLocation = await getFilteredReportData(schemeId, year, prn, revenueOrCapital, frn, true)

      return h.response({ file: reportLocation })
    }
  }
}

const { GET } = require('../../constants/methods')
const { getFilteredReportData } = require('../../report-data/get-filtered-report-data')

module.exports = {
  method: GET,
  path: '/payment-requests-report',
  options: {
    handler: async (request, h) => {
      const { schemeId, year, revenueOrCapital, prn, frn } = request.query
      const paymentRequestsReportData = await getFilteredReportData(schemeId, year, prn, revenueOrCapital, frn)
      return h.response({ paymentRequestsReportData })
    }
  }
}

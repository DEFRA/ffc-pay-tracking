const { GET } = require('../../constants/methods')
const { getARReportData } = require('../../report-data/get-AR-report-data')

module.exports = {
  method: GET,
  path: '/ar-report-data',
  options: {
    handler: async (request, h) => {
      const startDate = request.query.startDate ? new Date(request.query.startDate) : null
      const endDate = request.query.endDate ? new Date(request.query.endDate) : null
      const arReportData = await getARReportData(startDate, endDate)
      return h.response({ arReportData })
    }
  }
}

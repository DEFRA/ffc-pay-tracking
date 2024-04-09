const { GET } = require('../../constants/methods')
const { getAPReportData } = require('../../report-data/get-AP-report-data')

module.exports = {
  method: GET,
  path: '/ap-report-data',
  options: {
    handler: async (request, h) => {
      const startDate = request.query.startDate ? new Date(request.query.startDate) : null
      const endDate = request.query.endDate ? new Date(request.query.endDate) : null
      const apReportData = await getAPReportData(startDate, endDate)
      return h.response({ apReportData })
    }
  }
}

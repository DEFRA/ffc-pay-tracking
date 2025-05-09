const { AP } = require('../../constants/ledgers')
const { getAPARReportData } = require('../../report-data/get-AP-AR-report-data')

module.exports = {
  method: 'GET',
  path: '/ap-report-data',
  options: {
    handler: async (request, h) => {
      const startDate = request.query.startDate
        ? new Date(request.query.startDate)
        : null
      const endDate = request.query.endDate
        ? new Date(request.query.endDate)
        : null

      const reportLocation = await getAPARReportData(startDate, endDate, AP)

      return h.response({ file: reportLocation })
    }
  }
}

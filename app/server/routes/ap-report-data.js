const { AP } = require('../../constants/ledgers')
const { GET } = require('../../constants/methods')
const { saveAPARReportDataJson } = require('../../report-data/get-AP-AR-report-data')

module.exports = {
  method: GET,
  path: '/ap-report-data',
  options: {
    handler: async (request, h) => {
      const startDate = request.query.startDate
        ? new Date(request.query.startDate)
        : null
      const endDate = request.query.endDate
        ? new Date(request.query.endDate)
        : null

      console.log(`Generating AR report from ${startDate} to ${endDate}`)

      const reportFilePath = await saveAPARReportDataJson(startDate, endDate, AP)
      return h.response({ file: reportFilePath })
    }
  }
}

const { AR } = require('../../constants/ledgers')
const { GET } = require('../../constants/methods')
const { getAPARReportData } = require('../../report-data/get-AP-AR-report-data')

module.exports = {
  method: GET,
  path: '/ar-report-data',
  options: {
    handler: async (request, h) => {
      console.log("Hello")
      const startDate = request.query.startDate ? new Date(request.query.startDate) : null
      const endDate = request.query.endDate ? new Date(request.query.endDate) : null
      const arReportData = await getAPARReportData(startDate, endDate, AR)
      console.log(arReportData)
      return h.response({ arReportData })
    }
  }
}

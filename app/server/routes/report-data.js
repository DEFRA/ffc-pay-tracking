const { GET } = require('../../constants/methods')
const { getReportData } = require('../../report-data/get-report-data')

module.exports = [{
  method: GET,
  path: '/report-data',
  options: {
    handler: async (request, h) => {
      const reportData = await getReportData()
      return h.response({ reportData })
    }
  }
}]

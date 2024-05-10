const { GET } = require('../../constants/methods')
const { getRequestEditorReportData } = require('../../report-data/get-request-editor-report-data')

module.exports = {
  method: GET,
  path: '/request-editor-report-data',
  options: {
    handler: async (request, h) => {
      const startDate = request.query.startDate ? new Date(request.query.startDate) : null
      const endDate = request.query.endDate ? new Date(request.query.endDate) : null
      const reReportData = await getRequestEditorReportData(startDate, endDate)
      return h.response({ reReportData })
    }
  }
}

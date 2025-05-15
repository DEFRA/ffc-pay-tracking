const { GET } = require('../../constants/methods')
const { getRequestEditorReportData } = require('../../report-data/get-request-editor-report-data')

module.exports = {
  method: GET,
  path: '/request-editor-report',
  options: {
    handler: async (request, h) => {
      const reportLocation = await getRequestEditorReportData()

      return h.response({ file: reportLocation })
    }
  }
}

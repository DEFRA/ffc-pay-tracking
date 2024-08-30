const { GET } = require('../../constants/methods')
const { getTransactionSummaryData } = require('../../report-data/get-transaction-summary-data')

module.exports = {
  method: GET,
  path: '/transaction-summary',
  options: {
    handler: async (request, h) => {
      const { schemeId, frn } = request.query
      const reportData = await getTransactionSummaryData(schemeId, frn)
      return h.response({ reportData })
    }
  }
}

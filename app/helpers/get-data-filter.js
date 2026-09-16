const { getReportingDataFilter } = require('ffc-pay-schemes')

const getDataFilter = (data, previous = false) => {
  const filter = {
    paymentRequestNumber: previous ? data.paymentRequestNumber - 1 : data.paymentRequestNumber,
    sourceSystem: data.sourceSystem,
    frn: data.frn
  }

  const reportingDataFields = getReportingDataFilter(data.schemeId)
  for (const field of reportingDataFields) {
    filter[field] = data[field]
  }

  return filter
}

module.exports = {
  getDataFilter
}

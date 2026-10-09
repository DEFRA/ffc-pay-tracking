const REPORT_DATA_COLUMNS = require('../constants/report-data-columns')

const pickReportDataColumns = (data) => Object.fromEntries(
  Object.entries(data).filter(([key]) => REPORT_DATA_COLUMNS.includes(key))
)

module.exports = {
  pickReportDataColumns
}

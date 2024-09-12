const { PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../constants/events')
const { getDataFilter } = require('./get-data-filter')

const getWhereFilter = (event) => {
  const where = getDataFilter(event.data)
  where.correlationId = event.data.correlationId
  if ([PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED].includes(event.type)) {
    where.invoiceNumber = event.data.invoiceNumber
  }
  return where
}

module.exports = {
  getWhereFilter
}

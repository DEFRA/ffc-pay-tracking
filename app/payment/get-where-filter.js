const { PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../constants/events')

const getWhereFilter = (event) => {
  const where = {
    correlationId: event.data.correlationId,
    sourceSystem: event.data.sourceSystem,
    frn: event.data.frn,
    agreementNumber: event.data.agreementNumber
  }
  if ([PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED].includes(event.type)) {
    where.invoiceNumber = event.data.invoiceNumber
    where.ledger = event.data.ledger
  }
  return where
}

module.exports = {
  getWhereFilter
}

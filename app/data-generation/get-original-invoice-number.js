const { PAYMENT_EXTRACTED } = require('../constants/events')

const getOriginalInvoiceNumber = (event) => {
  if (event.type === PAYMENT_EXTRACTED) {
    return event.data.invoiceNumber
  }
  return null
}

module.exports = {
  getOriginalInvoiceNumber
}

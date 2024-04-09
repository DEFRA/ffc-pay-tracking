const { PAYMENT_PROCESSED } = require('../constants/events')

const isNewInvoiceNumber = (event, existingData) => {
  return event.type === PAYMENT_PROCESSED && event.data.originalInvoiceNumber && event.data.originalInvoiceNumber !== event.data.invoiceNumber && event.data.invoiceNumber !== existingData.invoiceNumber
}

module.exports = {
  isNewInvoiceNumber
}

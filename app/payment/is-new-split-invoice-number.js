const { PAYMENT_PROCESSED } = require('../constants/events')

const isNewSplitInvoiceNumber = (event, existingData) => {
  return event.type === PAYMENT_PROCESSED && event.data.invoiceNumber !== existingData.invoiceNumber && (event.data.invoiceNumber.includes('AV') || event.data.invoiceNumber.includes('BV'))
}

module.exports = {
  isNewSplitInvoiceNumber
}

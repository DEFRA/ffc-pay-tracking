const { PAYMENT_PROCESSED } = require('../constants/events')
const createSplitInvoiceNumber = require('./create-split-invoice-number')

const isNewSplitInvoiceNumber = (event, existingData) => {
  return event.type === PAYMENT_PROCESSED &&
    event.data.invoiceNumber !== existingData.invoiceNumber &&
    (event.data.invoiceNumber === createSplitInvoiceNumber(existingData.invoiceNumber, 'A', existingData.sourceSystem) ||
    event.data.invoiceNumber === createSplitInvoiceNumber(existingData.invoiceNumber, 'B', existingData.sourceSystem))
}

module.exports = {
  isNewSplitInvoiceNumber
}

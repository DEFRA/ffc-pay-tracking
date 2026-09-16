const { createSplitInvoiceNumber, getSchemeIdFromSourceSystem } = require('ffc-pay-schemes')
const { PAYMENT_PROCESSED } = require('../constants/events')

const isNewSplitInvoiceNumber = (event, existingData) => {
  const schemeId = getSchemeIdFromSourceSystem(existingData.sourceSystem)
  return event.type === PAYMENT_PROCESSED &&
    event.data.invoiceNumber !== existingData.invoiceNumber &&
    (event.data.invoiceNumber === createSplitInvoiceNumber(existingData.invoiceNumber, 'A', schemeId) ||
    event.data.invoiceNumber === createSplitInvoiceNumber(existingData.invoiceNumber, 'B', schemeId))
}

module.exports = {
  isNewSplitInvoiceNumber
}

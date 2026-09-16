const { getSchemeIdFromSourceSystem, isSitiAgri } = require('ffc-pay-schemes')

const getOriginalInvoiceNumberLike = (invoiceNumber, sourceSystem) => {
  if (!invoiceNumber) {
    return null
  }

  const schemeId = getSchemeIdFromSourceSystem(sourceSystem)
  if (isSitiAgri(schemeId)) {
    const sitiMininumInvoiceNumberLength = 10
    if (invoiceNumber.length < sitiMininumInvoiceNumberLength) {
      return null
    }
    // keep everything up to first element (8 chars)
    const firstElementLength = 8
    return `${invoiceNumber.slice(0, firstElementLength)}%`
  }

  const minimumInvoiceNumberLength = 4
  if (invoiceNumber.length < minimumInvoiceNumberLength) {
    return null
  }
  // cut off before the final element (final element index length = 4)
  const finalElementIndex = -4
  return `${invoiceNumber.slice(0, finalElementIndex)}%`
}

module.exports = {
  getOriginalInvoiceNumberLike
}

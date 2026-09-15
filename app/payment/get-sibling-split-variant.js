const { getSchemeIdFromSourceSystem, isSitiAgri } = require('ffc-pay-schemes')

const getInsertIndex = (invoiceNumber, sourceSystem) => {
  if (!invoiceNumber) {
    return -1
  }
  const schemeId = getSchemeIdFromSourceSystem(sourceSystem)
  if (isSitiAgri(schemeId)) {
    return 8
  }
  return invoiceNumber.length - 4
}

const getSiblingSplitVariant = (splitInvoiceNumber, sourceSystem) => {
  const i = getInsertIndex(splitInvoiceNumber, sourceSystem)
  if (i < 0 || i >= splitInvoiceNumber.length) {
    return null
  }
  const ch = splitInvoiceNumber[i]
  let other = null
  if (ch === 'A') {
    other = 'B'
  }
  if (ch === 'B') {
    other = 'A'
  }
  if (!other) {
    return null
  }
  return `${splitInvoiceNumber.slice(0, i)}${other}${splitInvoiceNumber.slice(i + 1)}`
}

module.exports = {
  getInsertIndex,
  getSiblingSplitVariant
}

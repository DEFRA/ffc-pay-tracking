const { SFI, SFI_PILOT, LUMP_SUMS, CS, BPS, SFI23, DELINKED, SFI_EXPANDED, COHT_REVENUE, COHT_CAPITAL } = require('../constants/source-systems')
const SITI_AGRI_SCHEMES = new Set([SFI, SFI_PILOT, LUMP_SUMS, CS, BPS, SFI23, DELINKED, SFI_EXPANDED, COHT_REVENUE, COHT_CAPITAL])

const getInsertIndex = (invoiceNumber, sourceSystem) => {
  if (!invoiceNumber) {
    return -1
  }
  if (SITI_AGRI_SCHEMES.has(sourceSystem)) {
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

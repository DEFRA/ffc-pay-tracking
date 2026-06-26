const { SFI, SFI_PILOT, LUMP_SUMS, CS, BPS, SFI23, DELINKED, SFI_EXPANDED, COHT_REVENUE, COHT_CAPITAL } = require('../constants/source-systems')
const SITI_AGRI_SCHEMES = new Set([SFI, SFI_PILOT, LUMP_SUMS, CS, BPS, SFI23, DELINKED, SFI_EXPANDED, COHT_REVENUE, COHT_CAPITAL])

const getOriginalInvoiceNumberLike = (invoiceNumber, sourceSystem) => {
  if (!invoiceNumber) {
    return null
  }

  if (SITI_AGRI_SCHEMES.has(sourceSystem)) {
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

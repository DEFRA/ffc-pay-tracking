const { SFI, SFI_PILOT, LUMP_SUMS, CS, BPS, SFI23, DELINKED, SFI_EXPANDED, COHT_REVENUE, COHT_CAPITAL } = require('../constants/source-systems')
const SITI_AGRI_SCHEMES = new Set([SFI, SFI_PILOT, LUMP_SUMS, CS, BPS, SFI23, DELINKED, SFI_EXPANDED, COHT_REVENUE, COHT_CAPITAL])

const getOriginalInvoiceNumberLike = (invoiceNumber, sourceSystem) => {
  if (!invoiceNumber) {
    return null
  }

  if (SITI_AGRI_SCHEMES.has(sourceSystem)) {
    if (invoiceNumber.length < 10) {
      return null
    }
    // keep everything up to first element (8 chars)
    return `${invoiceNumber.slice(0, 8)}%`
  }

  if (invoiceNumber.length < 4) {
    return null
  }
  // cut off before the final element (final element index length = 4)
  return `${invoiceNumber.slice(0, -4)}%`
}

module.exports = {
  getOriginalInvoiceNumberLike
}

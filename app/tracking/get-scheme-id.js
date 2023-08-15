const { SFI, SFI_PILOT, LUMP_SUMS, VET_VISITS, CS, BPS, FDMR, MANUAL, ES, FC, IMPS } = require('../constants/schemes')
const { sfi, sfip, lses, ahwr, cs, bps, fdmr, manual, genesis, glos, imps } = require('../constants/source-systems')

const getSchemeId = (sourceSystem, invoiceNumber) => {
  let scheme
  switch (sourceSystem) {
    case sfi:
      scheme = SFI
      break
    case sfip:
      scheme = SFI_PILOT
      break
    case lses:
      scheme = LUMP_SUMS
      break
    case ahwr:
      scheme = VET_VISITS
      break
    case cs:
      scheme = CS
      break
    case bps || fdmr:
      if (invoiceNumber.startsWith('F')) {
        scheme = FDMR
      } else {
        scheme = BPS
      }
      break
    case manual:
      scheme = MANUAL
      break
    case genesis:
      scheme = ES
      break
    case glos:
      scheme = FC
      break
    case imps:
      scheme = IMPS
      break
    default:
      scheme = undefined
      break
  }
  return scheme
}

module.exports = {
  getSchemeId
}

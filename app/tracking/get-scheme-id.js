const schemes = require('../constants/schemes')

const getSchemeId = (sourceSystem) => {
  console.log(sourceSystem)
  let scheme
  switch (sourceSystem) {
    case 'SFI':
      scheme = schemes.SFI
      break
    case 'SFIP':
      scheme = schemes.SFI_PILOT
      break
    case 'LSES':
      scheme = schemes.LUMP_SUMS
      break
    case 'AHWR':
      scheme = schemes.VET_VISITS
      break
    case 'SITI AGRI CS SYS':
      scheme = schemes.CS
      break
    case 'SITI AGRI SYS':
      scheme = schemes.BPS
      break
    case 'FDMR':
      scheme = schemes.FDMR
      break
    case 'Manual':
      scheme = schemes.MANUAL
      break
    case 'Genesis':
      scheme = schemes.ES
      break
    case 'GLOS':
      scheme = schemes.FC
      break
    case 'IMPS':
      scheme = schemes.IMPS
      break
  }
  return scheme
}

module.exports = {
  getSchemeId
}

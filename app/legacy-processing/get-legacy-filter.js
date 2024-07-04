const { BPS, FDMR, CS } = require('../constants/schemes')

const getLegacyFilter = (data, schemeId) => {
  switch (schemeId) {
    case BPS:
    case FDMR:
      return {
        sourceSystem: data.sourceSystem,
        frn: data.frn,
        marketingYear: data.marketingYear
      }
    case CS:
      return {
        sourceSystem: data.sourceSystem,
        frn: data.frn,
        claimNumber: data.claimNumber
      }
    default:
      return {
        sourceSystem: data.sourceSystem,
        frn: data.frn,
        marketingYear: data.marketingYear,
        agreementNumber: data.agreementNumber
      }
  }
}

module.exports = {
  getLegacyFilter
}

const { BPS, FDMR, CS } = require('../constants/schemes')
const db = require('../data')

const getLegacyFilter = (data, schemeId) => {
  const defaultFilter = {
    reportDataId: {
      [db.Sequelize.Op.ne]: data.reportDataId
    }
  }
  switch (schemeId) {
    case FDMR:
      return {
        ...defaultFilter,
        sourceSystem: data.sourceSystem,
        frn: data.frn,
        fdmrSchemeCode: data.fdmrSchemeCode
      }
    case BPS:
      return {
        ...defaultFilter,
        sourceSystem: data.sourceSystem,
        frn: data.frn,
        marketingYear: data.marketingYear
      }
    case CS:
      return {
        ...defaultFilter,
        sourceSystem: data.sourceSystem,
        frn: data.frn,
        claimNumber: data.claimNumber
      }
    default:
      return {
        ...defaultFilter,
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

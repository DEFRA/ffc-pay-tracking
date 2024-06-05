const { BPS, FDMR, CS } = require('./constants/schemes')

const getDataFilter = (data, requestNumber) => {
  const defaultFilter = {
    paymentRequestNumber: requestNumber - 1
  }

  switch (data.schemeId) {
    case BPS:
      return {
        ...defaultFilter,
        sourceSystem: data.sourceSystem,
        frn: data.frn,
        marketingYear: data.marketingYear
      }
    case FDMR:
      return {
        ...defaultFilter,
        sourceSystem: data.sourceSystem,
        frn: data.frn
      }
    case CS:
      return {
        ...defaultFilter,
        sourceSystem: data.sourceSystem,
        frn: data.frn,
        claimNumber: data.contractNumber
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
  getDataFilter
}

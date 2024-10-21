const { BPS, CS, FDMR } = require('../constants/schemes')

const getDataFilter = (data, previous) => {
  const defaultFilter = {
    paymentRequestNumber: previous ? data.paymentRequestNumber - 1 : data.paymentRequestNumber
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
        frn: data.frn,
        fdmrSchemeCode: data.invoiceLines[0].schemeCode
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

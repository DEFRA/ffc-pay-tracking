const { PAYMENT_PAUSED_LEDGER, PAYMENT_PROCESSED } = require('../constants/events')

const getDebtType = (event) => {
  if ([PAYMENT_PAUSED_LEDGER, PAYMENT_PROCESSED].includes(event.type)) {
    return formatDebtType(event.data.debtType)
  }
  return null
}

const formatDebtType = (type) => {
  if (type === 'irr') {
    return 'Irregular'
  } else if (type === 'adm') {
    return 'Administrative'
  }
  return null
}

module.exports = {
  getDebtType
}

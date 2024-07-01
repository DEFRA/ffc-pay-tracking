const { REVENUE, CAPITAL } = require('../constants/cs-types')
const { CS } = require('../constants/schemes')

const checkIfRevenueOrCapital = (paymentRequest) => {
  if (paymentRequest.schemeId !== CS) {
    return null
  }
  const dateParts = paymentRequest.dueDate?.split('/')
  const is01December = Number(dateParts[0]) === 1 && Number(dateParts[1]) === 12
  const is01January2016 = Number(dateParts[0]) === 1 && Number(dateParts[1]) === 1 && Number(dateParts[2]) === 2016

  if (is01December || is01January2016) {
    return REVENUE
  }
  return CAPITAL
}

module.exports = {
  checkIfRevenueOrCapital
}

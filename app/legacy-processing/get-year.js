const { REVENUE } = require('../constants/cs-types')

const getYear = (paymentRequest, revenueOrCapital) => {
  if (revenueOrCapital !== REVENUE) {
    return paymentRequest.marketingYear
  }
  const dateParts = paymentRequest.dueDate?.split('/')
  return Number(dateParts[2])
}

module.exports = {
  getYear
}

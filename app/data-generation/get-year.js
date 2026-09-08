const { getSchemeIds } = require('ffc-pay-schemes')
const { REVENUE } = require('../constants/cs-types')
const { getRevenue } = require('./get-revenue')

const { CS } = getSchemeIds()
const getYear = (event) => {
  if (event.data.schemeId === CS && getRevenue(event) === REVENUE) {
    const dueDate = new Date(event.data.dueDate)
    return dueDate.getFullYear()
  }
  return event.data.marketingYear
}

module.exports = {
  getYear
}

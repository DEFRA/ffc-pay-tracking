const { REVENUE, CAPITAL } = require('../constants/cs-types')
const { PAYMENT_EXTRACTED } = require('../constants/events')

const getRevenue = (event) => {
  if (event.data.schemeId !== 5) {
    return null
  }
  let dueDate
  if (event.type === PAYMENT_EXTRACTED) {
    // separate out date to avoid Americanisation - date format in extracted event is YYYY-MM-DD
    const dateParts = event.data.dueDate.split('-')
    const year = parseInt(dateParts[0], 10)
    const month = parseInt(dateParts[1], 10) - 1
    const day = parseInt(dateParts[2], 10)
    dueDate = new Date(year, month, day)
  } else {
    // if we don't have extracted event for any reason - date format will instead be DD/MM/YYYY
    const dateParts = event.data.dueDate.split('/')
    const day = parseInt(dateParts[0], 10)
    const month = parseInt(dateParts[1], 10) - 1
    const year = parseInt(dateParts[2], 10)
    dueDate = new Date(year, month, day)
  }
  // depending on the due date we know if it is revenue
  const is01December = dueDate.getDate() === 1 && dueDate.getMonth() === 11
  const is01January2016 = dueDate.getDate() === 1 && dueDate.getMonth() === 0 && dueDate.getFullYear() === 2016
  if (is01December || is01January2016) {
    return REVENUE
  }
  return CAPITAL
}

module.exports = {
  getRevenue
}

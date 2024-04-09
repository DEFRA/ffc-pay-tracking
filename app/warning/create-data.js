const moment = require('moment')
const { getWarningStatus, getPHError, getDAXError } = require('../data-generation')

const createData = (event) => {
  const data = {
    status: getWarningStatus(event),
    lastUpdated: moment(event.time).format(),
    phError: getPHError(event),
    daxError: getDAXError(event)
  }
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key, value]) => value !== null)
  )
  return filteredData
}

module.exports = {
  createData
}

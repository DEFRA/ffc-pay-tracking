const moment = require('moment')
const { getWarningStatus, getPHError, getDAXError } = require('../data-generation')

const errorStartingIndex = 0
const errorEndIndex = 255

const createData = (event) => {
  const data = {
    status: getWarningStatus(event),
    lastUpdated: moment(event.time).format(),
    phError: getPHError(event).substring(errorStartingIndex, errorEndIndex),
    daxError: getDAXError(event).substring(errorStartingIndex, errorEndIndex)
  }
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key, value]) => value !== null)
  )
  return filteredData
}

module.exports = {
  createData
}

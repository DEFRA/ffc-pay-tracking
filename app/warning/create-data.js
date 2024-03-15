const moment = require('moment')
const { DATE_FORMAT } = require('../constants/date-format')
const { getPHError, getDAXError, getStatus } = require('../data-generation')

const createData = (event) => {
  const data = {
    status: getStatus(event),
    lastUpdated: moment(event.data.time).format(DATE_FORMAT),
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
